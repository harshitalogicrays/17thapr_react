import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../features/Loader'

const Login = () => {
    const redirect=useNavigate()
    let [isLoading,setIsLoading]=useState(false)
  const {register,handleSubmit, formState: { errors } ,trigger}=useForm()
  let handleForm=async(data)=>{ 
    setIsLoading(true)
    try{
            let res = await fetch(`${import.meta.env.VITE_URL}/users?email=${data.email}`)
            let result = await res.json()
            // console.log(result[0])
            if(result.length==0){toast.error("Invalid Credentials")}
            else {
                if(result[0].password == data.password){
                    let obj = {isLoggedIn:true,email:data.email,name:result[0].username,role:result[0].role}
                    sessionStorage.setItem("17aprlogin",JSON.stringify(obj))
                    toast.success("LoggedIn Successfully")
                    if(result[0].role=='1') redirect('/')
                    else if(result[0].role=='0') redirect('/admin')
                    setIsLoading(false)
                }
                else {toast.error("Invalid Credentials");   setIsLoading(false)}
            }
    }
    catch(err){
        toast.error(err.message)
        setIsLoading(false)
    }
   }
return ( 
<>
{isLoading && <Loader/>}

<Container className='col-6 mt-5 shadow p-3'>
      <Form  onSubmit={handleSubmit(handleForm)}>
          <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text"  {...register('email',{required:"Email is required",
                  pattern:{value:/^[\w\!\#\$\%\^\.]+\@[\w]+\.[a-zA-Z]{2,3}$/,message:"Invalid Email"}
              })} onBlur={()=>trigger('email')}></Form.Control>
              {errors.email && <span className='text-danger'>{errors.email.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"  {...register('password',{required:"password is required"})} onBlur={()=>trigger('password')}></Form.Control>
              {errors.password && <span className='text-danger'>{errors.password.message}</span>}
          </Form.Group>

          <Button type="submit">Login</Button>
          <p>Create an account?? <Link to='/register'>Signup</Link></p>
      </Form>
 </Container>
 </>
  )
}

export default Login
