"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { z } from "zod"
import { FcGoogle } from "react-icons/fc";
import logo from '@/assets/icon.png'
import Link from "next/link";
import { loginSchema } from "@/lib/schema"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions/login"
import { signIn } from "next-auth/react"
import { DEFAULT_LOGGED_IN_REDIRRECT } from "@/routes"
import { useSearchParams } from "next/navigation"


export function LoginForm() {

  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already been used with another provider" : ""


   const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const googleSignIn = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGGED_IN_REDIRRECT
    })
  }


  function requestNewOTP (values: z.infer<typeof loginSchema>) {
    console.log(values)
  }

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError('')
    setSuccess('')
    startTransition(() => {
      login(values)
      .then((data) => {
        if (data?.error) {
          form.reset() 
          setError(data.error)
        }
        if (data?.success) {
          form.reset()
          setSuccess(data.success)
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true)
        }
      }).catch( (error) => {
        setError("Something Went Wrong!")
      })
    })
  }

  return (
    <div className=" flex flex-col bg-white px-12 py-12 border border-primary shadow-lg rounded-lg  w-full">
      <div className=" w-full items-center justify-center py-2 ">
        <Image src={logo} alt="" className=" h-16 w-16 bg-rd-300" />
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {showTwoFactor && (
          <div className=" w-full flex flex-col items-center justify-center text-center">
          <FormField
           control={form.control}
           name="code"
           render={({ field }) => (
             <FormItem>
               <FormLabel>An OTP is sent to your email address</FormLabel>
               <FormControl className=" flex items-center justify-center w-full text-center">
               <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
         {/* <Button className="" onClick={onSubmit}> Request New OTP</Button> */}
          </div>
        )

        }
        { !showTwoFactor && (
         <>
          <FormField
           control={form.control}
           name="email"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Email Address</FormLabel>
               <FormControl>
                 <Input type="email" disabled={isPending} className=" outline-primary" placeholder="Email Address" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
        <FormField
           control={form.control}
           name="password"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Password</FormLabel>
               <FormControl>
                 <Input type="password" disabled={isPending} className=" outline-primary" placeholder="Password" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
         </>
        )


        }
        <FormError message={error ||  urlError} />
        <FormSuccess message={success} />
       <Button type="submit" disabled={isPending} className=" bg-primary text-white hover:bg-black/90 w-full"> {showTwoFactor ? "Confirm OTP" : "Log In"} </Button>
      </form>
    </Form>
    <div className=" py-6">
    <Link href="/register" className=" flex justify-between space-x-2">
        <p className=""> Don't have an account ? </p>
        <span className=" font-semibold">Register</span>
    </Link>
      <fieldset className=" border-t-2 flex flex-col text-center items-center align-middle justify-center">
          <legend className=" self-center flex px-2 text-sm text-gray-600" >or log in with</legend>
          <div className=" py-4 w-full flex flex-row justify-between items-center  ">
            {/* <button onClick={() => googleSignIn("google")} className=" rounded-md hover:bg-gray-100 transition-all ease-in-out px-3 py-1 flex space-x-3  justify-center bg-white border-2  border-gray-300 ">
            <p className=" text-md">Log in with Google</p>
            <FcGoogle size={23} />
            </button> */}

            <Button asChild size={'sm'} variant={'link'} className=" font-semibold font-popping px-0 text-sm text-black ">
                 <Link href={'/forgot-password'}>Forgot Password</Link>
               </Button>
          </div>
        </fieldset>
      </div>
  
    </div>
  )
}