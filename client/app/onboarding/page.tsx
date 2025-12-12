"use client";

import { saveId, signupTeacher } from "@/lib/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ArrowLeft, BookOpenText, GraduationCap } from "lucide-react";

const page = () => {
   const [isFormShowing, setIsFormShowing] = useState(false);
   const [role, setRole] = useState<"Teacher" | "Student" | "">("");
   const [formValue, setFormValue] = useState("");
   const [studentForm, setStudentForm] = useState({
      studentId: "",
      password: "",
   });
   const [error, setError] = useState("");
   const [user] = useAuthState(auth);
   const { refetch } = useAuth();
   const router = useRouter();

   const handleLoginAsStudent = () => {
      setFormValue("");
      setStudentForm({
         studentId: "",
         password: "",
      });
      setRole("Student");
      setIsFormShowing(true);
   };

   const handleLoginAsTeacher = () => {
      setStudentForm({
         studentId: "",
         password: "",
      });
      setFormValue(user?.displayName!);
      setRole("Teacher");
      setIsFormShowing(true);
   };

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (role == "Student") {
         setError("");

         if (!/^\d+$/.test(studentForm.studentId)) {
            return setError("Student ID must contain only numbers.");
         }

         if (studentForm.studentId.length !== 8) {
            return setError("Student ID should be 8 characters long.");
         }

         if (!user?.email || !user?.displayName) {
            return setError(
               "Email or Display Name is not defined. Please sign in with google first."
            );
         }

         if (studentForm.password.length < 8) {
            return setError("Password must be at least 8 characters long.");
         }

         if (!/[A-Z]/.test(studentForm.password)) {
            return setError(
               "Password must contain at least one uppercase letter."
            );
         }

         if (!/[0-9]/.test(studentForm.password)) {
            return setError("Password must contain at least one number.");
         }

         if (!/[@$!%*?&]/.test(studentForm.password)) {
            return setError(
               "Password must contain at least one special character."
            );
         }

         const [data] = await saveId(
            studentForm.studentId,
            user?.email,
            user?.displayName,
            studentForm.password
         );

         if (!data.success) {
            return setError(data.message);
         }

         if (data.success) {
            await refetch();
            router.push("/");
         }
      }

      if (role == "Teacher") {
         if (formValue.trim() == "") {
            return setError("Name must not be empty");
         }

         if (formValue.trim().length < 3) {
            return setError("Name must be atleast 3 characters");
         }

         if (!user?.email || !user?.displayName) {
            return setError(
               "Email or Display Name is not defined. Please sign in with google first."
            );
         }

         const [data] = await signupTeacher(user?.email, user?.displayName);

         if (data.success) {
            router.push("/");
         }
      }
   };

   if (!user?.email) return <div>Email Required</div>;

   return (
      <div className="flex items-center justify-center h-screen w-screen">
         <div className="flex flex-col h-full lg:h-max w-full lg:w-max justify-center items-center gap-10 p-8 lg:p-10 lg:rounded-md lg:border bg-secondary">
            <div className="flex flex-col items-center gap-2">
               <h1 className="text-3xl font-bold">Welcome to TrackNFind</h1>
               <h2 className="text-lg font-semibold text-muted-foreground">
                  What brings you here?
               </h2>
            </div>
            {isFormShowing ? (
               <form
                  className="w-full flex flex-col gap-2"
                  onSubmit={handleSubmit}>
                  <div
                     className="hover:underline cursor-pointer flex gap-2 items-center"
                     onClick={() => setIsFormShowing(false)}>
                     <ArrowLeft size={18}/>
                     Back
                  </div>
                  {role == "Student" ? (
                     <>
                        <label htmlFor="id" className="font-bold text-sm">
                           Student ID
                        </label>
                        <input
                           id="id"
                           type="text"
                           value={studentForm.studentId}
                           placeholder={`Enter Student ID`}
                           onChange={(e) =>
                              setStudentForm((prev) => ({
                                 ...prev,
                                 studentId: e.target.value,
                              }))
                           }
                           className="border py-2 px-4 rounded-md bg-background"
                           required
                        />

                        <label htmlFor="password" className="font-bold text-sm">
                           Password
                        </label>
                        <input
                           id="password"
                           type="text"
                           value={studentForm.password}
                           placeholder={`Enter password`}
                           onChange={(e) =>
                              setStudentForm((prev) => ({
                                 ...prev,
                                 password: e.target.value,
                              }))
                           }
                           className="border py-2 px-4 rounded-md bg-background"
                           required
                        />
                     </>
                  ) : (
                     <>
                        <label htmlFor="username" className="font-bold text-sm">
                           Confirm Name
                        </label>
                        <input
                           id="username"
                           type="text"
                           value={formValue}
                           placeholder={`Enter you name`}
                           onChange={(e) => setFormValue(e.target.value)}
                           className="border py-2 px-4 rounded-md bg-background"
                           required
                        />
                     </>
                  )}
                  <span className="text-sm text-red-500">
                     {!!error && error}
                  </span>
                  <button className="bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700">
                     {role == "Student" ? "Save" : "Yes, this is my name"}
                  </button>
               </form>
            ) : (
               <div className="flex gap-5 flex-wrap lg:flex-nowrap justify-center">
                  <div
                     className="border h-max lg:h-30 w-full rounded-md p-4 shadow-md bg-background cursor-pointer hover:shadow-xl"
                     onClick={() => handleLoginAsStudent()}>
                     <div className="flex gap-3 items-center mb-5">
                        <GraduationCap size={18} />
                        <h3 className="font-bold text-lg">I am a student</h3>
                     </div>
                     <p className="text-sm text-gray-600">
                        I am currently studying at Cordova Public College.
                     </p>
                  </div>
                  <div
                     className="border h-max lg:h-30 w-full rounded-md p-4 shadow-md bg-background cursor-pointer hover:shadow-xl"
                     onClick={() => handleLoginAsTeacher()}>
                     <div className="flex gap-3 items-center mb-5">
                        <BookOpenText size={18} />
                        <h3 className="font-bold text-lg">I am a teacher</h3>
                     </div>
                     <p className="text-sm text-gray-600">
                        I teach wonderful students at Cordova Public College.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default page;
