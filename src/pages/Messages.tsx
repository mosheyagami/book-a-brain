import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageSquare, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchConversations();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedBooking) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [selectedBooking]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tutor:profiles!bookings_tutor_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          learner:profiles!bookings_learner_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          skill:skills!bookings_skill_id_fkey (
            name
          ),
          latest_message:messages (
            content,
            created_at
          )
        `)
        .or(`tutor_id.eq.${profile.id},learner_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get latest message for each booking
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (booking) => {
          const { data: latestMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('booking_id', booking.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...booking,
            latest_message: latestMessage?.[0] || null
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedBooking) return;
    
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('booking_id', selectedBooking.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedBooking) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${selectedBooking.id}`
        },
        (payload) => {
          // Fetch the complete message with sender info
          supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey (
                first_name,
                last_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages(prev => [...prev, data]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedBooking || !profile) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          booking_id: selectedBooking.id,
          sender_id: profile.id,
          content: newMessage.trim()
        }]);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (booking: any) => {
    return profile?.id === booking.tutor_id ? booking.learner : booking.tutor;
  };

  const getConversationTitle = (booking: any) => {
    const other = getOtherParticipant(booking);
    return `${other.first_name} ${other.last_name}`;
  };

  if (loading || loadingConversations) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Chat with your {profile.user_type === 'tutor' ? 'students' : 'tutors'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] overflow-y-auto">
                  {conversations.length > 0 ? (
                    conversations.map((booking) => {
                      const other = getOtherParticipant(booking);
                      const isSelected = selectedBooking?.id === booking.id;
                      
                      return (
                        <div
                          key={booking.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${
                            isSelected ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={other.avatar_url} />
                              <AvatarFallback>
                                {other.first_name?.[0]}{other.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">
                                  {getConversationTitle(booking)}
                                </h3>
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {booking.skill.name} - {booking.lesson_date}
                              </p>
                              {booking.latest_message && (
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground truncate">
                                    {booking.latest_message.content}
                                  </p>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDistanceToNow(new Date(booking.latest_message.created_at), { addSuffix: true })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No conversations yet</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.user_type === 'tutor' 
                          ? 'Messages will appear here when students book lessons with you'
                          : 'Messages will appear here when you book lessons with tutors'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              {selectedBooking ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={getOtherParticipant(selectedBooking).avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {getConversationTitle(selectedBooking)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedBooking.skill.name} • {selectedBooking.lesson_date} • {selectedBooking.start_time}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  
                  {/* Messages */}
                  <CardContent className="p-4 h-[400px] overflow-y-auto">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwnMessage = message.sender_id === profile.id;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                                {!isOwnMessage && (
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender.avatar_url} />
                                    <AvatarFallback className="text-xs">
                                      {message.sender.first_name?.[0]}{message.sender.last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`p-3 rounded-lg ${
                                    isOwnMessage
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    isOwnMessage 
                                      ? 'text-primary-foreground/70' 
                                      : 'text-muted-foreground'
                                  }`}>
                                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">Start the conversation</h3>
                          <p className="text-sm text-muted-foreground">
                            Send a message to get started
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={sending}
                      />
                      <Button type="submit" disabled={sending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;