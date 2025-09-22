

import { useState } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  return (
    <div>
      <div>
        <p>Upload File to S3 with Pre-Signed URL</p>
        <input
          type="file"
          onChange={e => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          max={1}
          accept="application/pdf,image/png,image/jpeg"
        />
        <button
          onClick={async () => {
            if (file === null) {
              throw new Error('File is null');
            }
                                        //https://20yhai8mrg.execute-api.us-east-1.amazonaws.com/prod/api/dealership/uploadUrl
            const response = await fetch('https://20yhai8mrg.execute-api.us-east-1.amazonaws.com/prod/api/dealership/uploadUrl', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'bDwtDUKzjj9U3pWfC7xwY4ngSgsqCYRT5YLeo0kB'
              },
              body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
            });
            const json = await response.json();
            console.log('PRE-SIGN Response:', json);

            if (json.status === 'success') {
              const putResponse = await fetch(json.data.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                  'Content-Type': file.type,
                  'x-amz-tagging': json.data.uploadTags,
                },
              });
              console.log('PUT Response:', putResponse);
              setFiles([json.data])
            } else {
              setError(json?.message ?? 'Fail to upload')
            }
          }}
          disabled={file === null}
        >
          Upload
        </button>
      </div>

      {error && (
        <div>
          <div className='error'>{error}</div>
        </div>
      )}

      {file && (
        <div>
          <h4>File info</h4>
          <div>Name: {file.name}</div>
          <div>Type: {file.type}</div>
          <div>Size: {file.size}</div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <ul>
            {files.map(({ downloadUrl, fileName }) => (
              <li key={fileName}><a href={downloadUrl} target='_blank'>{fileName}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;