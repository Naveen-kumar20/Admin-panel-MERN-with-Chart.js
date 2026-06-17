import loginImage from "../assets/login_signup_image.jpg";

function AuthImage() {
	return (
		<div className="hidden relative lg:flex h-full w-1/2">
			<img
				src={loginImage}
				alt="image"
				className="w-full h-full object-cover"
			/>
			<div className="absolute w-3/4 top-50 left-5">
				<h2 className="text-white text-4xl font-bold">
					Turn your complex
				</h2>
				<h2 className="text-white text-4xl font-bold">
					data into clear action.
				</h2>
				<p className="text-gray-300 text-xs mt-3">
					The precision-engineered dashboard for analysts who demand
					clarity, speed, and authoritative insights.
				</p>
			</div>
		</div>
	);
}

export default AuthImage;
