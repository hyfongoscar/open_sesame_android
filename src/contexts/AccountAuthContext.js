import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
//connect firestore
import firestore from '@react-native-firebase/firestore';

export const AccountAuthContext = createContext();

const AccountAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
      <AccountAuthContext.Provider
          value={{
            user,
            loading,
            login: async (email, password) => {
              let obj = {}
              await auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                  obj.userCredential = userCredential
                  setUser(userCredential.user)
                })
                .catch(error => {
                  obj.errorCode = error.code;
                  obj.errorMessage = error.message;
                });
              return obj
            },
            register: async (displayName, email, password) => {
            //add user name to firestore
              firestore()
                  .collection('username')
                  // use email as doc id
                  .doc(email)
                  .set({
                    // name field
                    name: displayName,
                    // id field
                    id: (collectionSnapshot.size - 1),
                  })
                  .then(() => {
                    console.log('username registered');
                  });
          // end of newly added part
              let obj = {}
              await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                  obj.userCredential = userCredential
                })
                .catch(error => {
                  obj.errorCode = error.code;
                  obj.errorMessage = error.message;
                });
              return obj
            },
            logout: async () => {
              await auth()
                .signOut()
                .then(() => console.log('User signed out!'));
            },
          }}
      >
        {children}
      </AccountAuthContext.Provider>
  );
};

export default AccountAuthContextProvider
