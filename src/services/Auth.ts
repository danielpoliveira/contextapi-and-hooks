interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}


export function signIn(): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'skaodkodadkpdkaodasdpokapdoakdpaokdosapkpod',
        user: {
          name: 'Daniel',
          email: 'dani.edm@outlook.com'
        },
      })
    }, 2000);
  });
}