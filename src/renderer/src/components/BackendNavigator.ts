import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BackendNavigator = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Listen for navigation commands from the backend
		window.context.navigate((path) => {
			navigate(path);
		});

		return () => {
			window.context.removeAllListeners("navigate");
		};
	}, [navigate]);

	return null;
};

export default BackendNavigator;
