'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const { jobId } = useParams();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) setCurrentUser(user.email);
    };
    fetchUser();
    
    const urlParams = new URLSearchParams(window.location.search);
    setOtherUser(urlParams.get('participant'));
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `job_id=eq.${jobId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [jobId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !otherUser) return;
    
    const { error } = await supabase
      .from('messages')
      .insert({
        job_id: jobId,
        sender: currentUser,
        receiver: otherUser,
        content: newMessage
      });
    
    if (!error) setNewMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === currentUser ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === currentUser ? 'bg-green-100' : 'bg-gray-100'}`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-lg p-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}