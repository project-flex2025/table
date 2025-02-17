import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter username" },
        password: { label: "Password", type: "password", placeholder: "Enter password" },
      },
      async authorize(credentials) {
        console.log(credentials,"cred");
        
        try {
          const response = await fetch("http://183.82.7.208:3002/anyapp/authentication/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
              app_secret:process.env.app_secret,
              device_id:"device_unique_id"
            }),
          });
      
          const data = await response.json();
          console.log("API Response:", data);
      
          if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
          }
      
          return { id: data.userId, name: data.name, email: data.email, token: data.token };
        } catch (error) {
          console.error("Authentication Error:", error);
          // throw new Error(error.message || "Authentication failed");
          throw new Error("Authentication failed");

        }
      }
      
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id as string;
  //     }
  //     return session;
  //   },
  // },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };



// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "Enter username" },
//         password: { label: "Password", type: "password", placeholder: "Enter password" },
//       },
//       async authorize(credentials) {
//         const user = { id: "5", name: "admin", email: "admin@example.com" };

//         // Dummy authentication (Replace with actual DB validation)
//         if (credentials?.username === "flex_admin" && credentials?.password === "password") {
//           return user;
//         }
//         throw new Error("Invalid username or password");
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", // Redirect here if not authenticated
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Set in .env.local
//   session: { strategy: "jwt" }, // Using JWT-based session storage
// });

// export { handler as GET, handler as POST };

