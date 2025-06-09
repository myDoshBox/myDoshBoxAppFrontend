import React from "react";
import {
	NeutralsSidenav,
	UserSidenav,
} from "../../components/NavbarComponents/SideNavbar";
import Homepage from "../GENERAL_PAGES/Homepage";
import { Route, Routes } from "react-router-dom";
import { SignInForm } from "../AUTHENTICATION_PAGES/SignIn";
import Error404 from "../GENERAL_PAGES/Error404";
import { SignUpOrganizationForm } from "../../components/FormComponents.js/AuthenticationForms";

const UsersDashboardRoutes = () => {
	return (
		<Routes>
			<Route index element={<NeutralsSidenav />}>
				{/* // <Routes> */}
				{/* <Route element={<UserSidenav />}> */}
				{/* <Route path="transactions"></Route> */}
				{/* <Route path="transaction_history"></Route>
				<Route path="chats"></Route>
				<Route path="notifications"></Route>
				<Route path="disputes"></Route>
            <Route path="settings"></Route> */}
				{/* <Route path="logout" element={<Homepage />} /> */}
				{/* </Route> */}

				<Route path="dash" element={<SignInForm />} />
				<Route path="goss" element={<SignUpOrganizationForm />} />
				{/* <Route path="*" element={<Error404 />} /> */}
				{/* <Route path="logout" element={<Homepage />} /> */}
				{/* </Routes> */}
			</Route>
		</Routes>
	);
};

export default UsersDashboardRoutes;
