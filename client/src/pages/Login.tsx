import { Link } from "react-router-dom";
import { useState } from "react";
import AuthImage from "../components/AuthImage";
import { axiosInstance } from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import toast from "react-hot-toast";

interface formDataOptionalInterface {
	email?: string;
	password?: string;
}
function Login() {

	const dispatch = useDispatch()

	const [formData, setFormData] = useState<{
		email: string;
		password: string;
	}>({
		email: "",
		password: "",
	});

	const [error, setError] = useState<formDataOptionalInterface>({});
	const [loading, setLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true)
			const res = await axiosInstance.post('/auth/login', formData)
			const {user, accessToken} = res.data
			toast.success(res.data.message)
			dispatch(setCredentials({user, accessToken}))
		} catch (error:any) {
			if(error.response){
				toast.error(error.response.data.message)
			}
		}finally{
			setLoading(false)
		}
	};

	const validateForm = ():boolean => {
		const newError: formDataOptionalInterface = {};
		if (!formData.email.trim()) {
			newError.email = "Enter email";
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
		) {
			newError.email = "Invalid email address";
		}

		if(!formData.password.trim()){
			newError.password = "Enter password"
		}
		setError(newError)

		return Object.keys(newError).length === 0
	};

	return (
		<div className="h-screen w-full flex justify-center items-center">
			{/* left side content visible on laptop screen */}
			<AuthImage/>

			{/* Right side form */}
			<div className="flex flex-col lg:justify-center gap-4 w-full md:w-1/3 lg:w-1/2 lg:h-full md:bg-gray-50 p-4 lg:px-20">
				<h2 className="text-2xl font-semibold">Login</h2>
				<p className="text-xs text-gray-500">
					Enter your credentials to access your workspace
				</p>
				<form
					onSubmit={handleForm}
					className="flex flex-col items-center justify-center gap-3"
				>
					<div className="flex flex-col w-full gap-1">
						<label htmlFor="email" className="text-xs">
							Email:{" "}
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter email"
							className="bg-gray-100 px-2 py-1 outline-none rounded-xs border border-gray-300 text-sm"
						/>
						{error.email && <p className="text-xs text-red-500">{error.email}</p>}
					</div>
					<div className="flex flex-col gap-1 w-full">
						<label htmlFor="password" className="text-xs">
							Password:{" "}
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter password"
							className="bg-gray-100 px-2 py-1 outline-none rounded-xs border border-gray-300 text-sm"
						/>
						{error.password && <p className="text-xs text-red-500">{error.password}</p>}
					</div>
					<button type="submit" disabled={loading} className={`bg-[#0D9488] text-white w-1/2 py-1 px-4 rounded-xs cursor-pointer mt-2 ${loading && 'opacity-60 hover:cursor-not-allowed'}`}>
						{loading ? ". . ." : "Login"}
					</button>
				</form>
				<p className="text-center text-xs">
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-700 underline">
						Signup
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
