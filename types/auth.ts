
// ?? User Login Info Frappe
export interface LoginStructure {
  email: string;
  password: string;
}

// ?? User SignUp with FRappe
export interface SignUpStructure {
   full_name: string,
   phone: number,
   email: string,
   password: string
}

// ?? Logged-in user returned by the API
export interface User {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
}