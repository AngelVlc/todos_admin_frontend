import React from 'react';
import { useAlert } from 'react-alert'

export const HomePage = () => {
    const alert = useAlert()

    return (
        <div>
            <h4>HOME PAGE</h4>

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
