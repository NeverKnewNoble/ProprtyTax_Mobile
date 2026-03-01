import { SignUpStructure } from "@/types/auth";
import { api } from "@/utils/config/api_client";


// ** FUNTION TO SIGNUP A NEW USER FRAPPE CONNECTION
export async function Signup(signUpDetails: SignUpStructure): Promise<any> {
    try{
        const { full_name, phone, email, password } = signUpDetails;
        // Check signup login
        console.log("signing up with", full_name, phone, email, password);

        //  Make API request to signup endpoint
        const response = await api.post("/api/v2/method/property_collection.api.signup.signUp", {
            full_name, 
            phone, 
            email, 
            password
        });

        return {
            success: true,
            message: 'SignUp successful',
            data: response.data,
        };
    } catch(err: any) {
        console.log(err, "Failed to establish signup connection");
        throw err;
    }
}