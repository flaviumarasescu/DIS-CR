import './App.css';
import { useState } from 'react';
import axios from 'axios';
import concertImage from './imagine-concert.jpg';

function App() {
  const [data, setData] = useState({});

  const getData = async () => {
    const resPost = await axios
      .post(
        'api/query/concert',
        {
          concertData: {
            concertId: '60a1f8b7bb24d732c88b1c71',
            userPIN: '60a1f8b7bb24d732c88b1c72',
            tickets: [
              { ticketId: '60a1f8b7bb24d732c88b1c79', seatNumber: 'A1' },
              { ticketId: '60a1f8b7bb24d732c88b1c78', seatNumber: 'A2' },
            ],
            expirationTime: '2024-02-25T12:00:00Z',
          },
          paymentData: {
            userPIN: '60a1f8b7bb24d732c88b1c72',
            amount: 100.0,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'arraybuffer',
        }
      )
      .catch((e) => console.log('e', e));

    const pdfBlob = new Blob([resPost.data], { type: 'application/pdf' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'downloaded.pdf';

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);

    console.log('PDF downloaded successfully!');
  };

  console.log('  {data}', data);
  return (
    <div className='App'>
      <div>Ticketing app Chain of Responsibility</div>

      <div>
        <img src={concertImage} alt='concert-image' />
        <span>
          Concert Coldplay pe Arena Nationala din Bucuresti - Delivered by DHL
        </span>
        <span>Arena Națională</span>
        <button onClick={() => getData()}>Buy ticket</button>
      </div>
    </div>
  );
}

export default App;
