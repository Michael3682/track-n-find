export interface User {
   id: string,
   name: string,
   email?: string,
   password: string 
}

//   id        String @id
//   name      String
//   email     String @unique
//   password  String