import React, { useState } from 'react';

const Messages = () => {
  const [conversations] = useState([
    { id: 1, name: "System", message: "Welcome to Kaarya Messages!", time: "Now" }
  ]);

  return (
    <div className="section">
      <div className="container" style={{maxWidth: '1000px'}}>
        <div className="card" style={{height: '600px', padding: '0', display: 'flex', overflow: 'hidden'}}>
          
          <div style={{width: '300px', borderRight: '1px solid #ccc', backgroundColor: '#f9f9f9'}}>
            <div style={{padding: '20px', borderBottom: '1px solid #ccc'}}>
              <h2 className="font-bold">Messages</h2>
            </div>
            <div style={{overflowY: 'auto'}}>
               {conversations.map(chat => (
                   <div key={chat.id} style={{padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: '#fff'}}>
                       <h3 className="font-bold" style={{fontSize: '16px', marginBottom: '5px'}}>{chat.name}</h3>
                       <p className="text-gray-500" style={{fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{chat.message}</p>
                   </div>
               ))}
            </div>
          </div>

          <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#888'}}>
               <div className="text-center">
                   <p style={{fontSize: '48px', marginBottom: '20px'}}>💬</p>
                   <p>Select a conversation to start messaging</p>
               </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;