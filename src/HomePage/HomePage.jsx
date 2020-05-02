import React from 'react';
import { useAlert } from 'react-alert'

function HomePage() {
    const alert = useAlert()

    return (
        <div>
            <h4>HOME PAGE</h4>

            <p>Backend url: {process.env.REACT_APP_BACKEND_URL}</p>

            <button
            onClick={() => {
              alert.show('Oh look, an alert!')
            }}
          >
            Show Alert
          </button>
        </div>
    );
}

export { HomePage };