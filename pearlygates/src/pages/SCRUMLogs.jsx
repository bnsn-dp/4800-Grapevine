import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SCRUMLogs() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const fileUrls = ['/testtxt.txt', '/meeting911.txt'];

    const fetchFiles = async () => {
      try {
        const filePromises = fileUrls.map(async (url) => {
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            return { name: url.split('/').pop(), content: text };
          }
          throw new Error('File not found');
        });

        const fileContents = await Promise.all(filePromises);
        setFiles(fileContents);
        if (fileContents.length > 0) {
          setSelectedFile(fileContents[0]);
        }
      } catch (error) {
        console.error('Error fetching the files:', error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileClick = (file) => {setSelectedFile(file); setIsContentVisible(true);};

  const downloadFile = (file) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: 'gold' }}>SCRUM Logs</h1>
        <button onClick={() => { navigate("/"); }}>Return Home</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        {files.length > 0 && (
          <div>
            {files.map((file, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <span onClick={() => handleFileClick(file)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', display: 'inline-block', marginRight: '10px'}}
                >
                  {file.name}
                </span>
                <button onClick={() => downloadFile(file)} disabled={!file.content}>
                  Download
                </button>
                {selectedFile === file && isContentVisible && (
                  <pre style={{whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '10px', border: '2px', borderRadius: '4px', color: 'black'
                  }}>
                    {file.content}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SCRUMLogs;