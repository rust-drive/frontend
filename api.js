/*
  API for Rust Drive.

  Here all API commands are called by JS.
*/


export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString()+"SameSite=Lax;";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  
// Function for getting a token
export async function get_token(user_id, password) {
      // the url of the token endpoint
      const url = 'http://localhost:8000/auth/get-token';
  
      // the options for the fetch request
      const options = {
          method: 'GET',
          headers: {
              // base64 encode the user_id and password
              Authorization: 'Basic ' + btoa(user_id + ':' + password),
              // set the content type to json
              'Content-Type': 'application/json'
          }
      };
  
      try {
          // make the request
          const response = await fetch(url, options);
          // get the token from the response
          const token = await response.text();
          // if the request was successful
          if (response.ok) {
              // store the token in a cookie
              setCookie("token", token, 10);
              // return the token
              return token;
          } else {
              // throw an error with the token
              throw new Error(token);
          }
      } catch (error) {
          console.error(error);
      }
  }

// Gets a list of all files in a directory
export async function file_list(path) {
    const url = '/api/file-list/' + path;
    const token = getCookie("token");
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await fetch(url, options);
    return await response.json();
  }

// Gets the content of the file as response
export async function file_content(params) {
  const url = '/api/file_content/' + path;
    const token = getCookie("token");
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await fetch(url, options);
    return await response.text();
}