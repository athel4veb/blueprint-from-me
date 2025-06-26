
import { useState } from 'react';
import { useMessages } from '@/presentation/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const { messages, unreadCount, sendMessage, markAsRead, isSending } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newMessageTo, setNewMessageTo] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);

  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) return;

    sendMessage({
      senderId: user?.id || '',
      recipientId: selectedMessage.senderId === user?.id ? selectedMessage.recipientId : selectedMessage.senderId,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent,
      isRead: false,
      jobId: selectedMessage.jobId
    });

    setReplyContent('');
  };

  const handleSendNewMessage = () => {
    if (!newMessageTo || !newMessageContent.trim()) return;

    sendMessage({
      senderId: user?.id || '',
      recipientId: newMessageTo,
      subject: newMessageSubject,
      content: newMessageContent,
      isRead: false
    });

    setNewMessageTo('');
    setNewMessageSubject('');
    setNewMessageContent('');
    setShowNewMessage(false);
  };

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    if (!message.isRead && message.recipientId === user?.id) {
      markAsRead(message.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Communicate with companies and promoters</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {unreadCount} unread
              </Badge>
              <Button onClick={() => setShowNewMessage(true)}>
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  All Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No messages yet</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      } ${!message.isRead && message.recipientId === user?.id ? 'font-bold' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {message.senderId === user?.id ? 'To: ' : 'From: '}
                          {message.senderId === user?.id ? message.recipientId : message.senderId}
                        </span>
                        {!message.isRead && message.recipientId === user?.id && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm mb-1">{message.subject || 'No Subject'}</p>
                      <p className="text-xs text-gray-500 truncate">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedMessage.subject || 'No Subject'}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {selectedMessage.senderId === user?.id ? 'To: ' : 'From: '}
                      {selectedMessage.senderId === user?.id ? selectedMessage.recipientId : selectedMessage.senderId}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(selectedMessage.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-3">Reply</h3>
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="mb-3"
                    />
                    <Button onClick={handleSendReply} disabled={isSending || !replyContent.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : showNewMessage ? (
              <Card>
                <CardHeader>
                  <CardTitle>New Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Recipient ID"
                    value={newMessageTo}
                    onChange={(e) => setNewMessageTo(e.target.value)}
                  />
                  <Input
                    placeholder="Subject"
                    value={newMessageSubject}
                    onChange={(e) => setNewMessageSubject(e.target.value)}
                  />
                  <Textarea
                    placeholder="Message content..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSendNewMessage} disabled={isSending || !newMessageContent.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a message to view its content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
