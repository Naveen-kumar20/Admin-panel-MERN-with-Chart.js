import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthImage from "../components/AuthImage";
import { axiosInstance } from "../api/axiosInstance";
import toast from "react-hot-toast";

interface formDataOptionalInterface {
	name?: string;
	email?: string;
	password?: string;
}

function Signup() {
	const navigate = useNavigate()

	const [formData, setFormData] = useState<{
		name: string;
		email: string;
		password: string;
	}>({
		name: "",
		email: "",
		password: "",
	});

	//made for form validation
	const [error, setError] = useState<formDataOptionalInterface>({});
	const [loading, setLoading] = useState(false);

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
			const res = await axiosInstance.post("/auth/signup", formData);
			navigate('/login')
			toast.success(res.data.message);
		} catch (error:any) {
			if(error.response){
				toast.error(error.response.data.message)
			}
		}finally{
			setLoading(false)
		}
	};

	// validation logic for form
	const validateForm = (): boolean => {
		const newError: formDataOptionalInterface = {};

		// name validation
		if (!formData.name.trim()) {
			newError.name = "Enter name";
		} else if (formData.name.length < 3) {
			newError.name = "Name should be atleast of 3 letters.";
		}

		//email validation
		if (!formData.email.trim()) {
			newError.email = "Enter email";
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
		) {
			newError.email = "Invalid email address";
		}

		//password validation
		if (!formData.password.trim()) {
			newError.password = "Enter password";
		} else if (formData.password.length < 6) {
			newError.password = "Password must be of atleast 6 characters";
		}
		setError(newError);

		return Object.keys(newError).length === 0; //will change later
	};

	return (
		<div className="h-screen w-full flex justify-center items-center">
			{/* left side content visible on laptop screen */}
			<AuthImage />

			{/* Right side form */}
			<div className="flex flex-col lg:justify-center gap-4 w-full md:w-1/3 lg:w-1/2 lg:h-full  md:bg-gray-50 p-4 lg:px-20">
				<h2 className="text-2xl font-semibold">Create your account</h2>
				<p className="text-xs text-gray-500">
					Enter details to register
				</p>
				<form
					onSubmit={handleForm}
					className="flex flex-col items-center justify-center gap-3"
				>
					<div className="flex flex-col w-full gap-1">
						<label htmlFor="name" className="text-xs">
							Name:{" "}
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter name"
							className="bg-gray-100 px-2 py-1 outline-none rounded-xs border border-gray-300 text-sm"
						/>
						{error.name && (
							<p className="text-xs text-red-500">{error.name}</p>
						)}
					</div>
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
						{error.email && (
							<p className="text-xs text-red-500">
								{error.email}
							</p>
						)}
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
						{error.password && (
							<p className="text-xs text-red-500">
								{error.password}
							</p>
						)}
					</div>
					<button disabled={loading} className={`bg-[#0D9488] text-white w-1/2 py-1 px-4 rounded-xs cursor-pointer mt-2 ${loading && "opacity-60 hover:cursor-not-allowed"}`}>
						{loading ? ". . . " : "Signup"}
					</button>
				</form>
				<p className="text-center text-xs">
					Already registered?{" "}
					<Link to="/login" className="text-blue-700 underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;
