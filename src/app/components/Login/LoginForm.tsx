"use client";

import { useState } from "react";
import { doesProfileExist } from "@/actions/doesProfileExist";
import { submitLoginForm } from "@/actions/login";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
	existingProfileId?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ existingProfileId }) => {
	const [profileExists, setProfileExists] = useState(existingProfileId !== undefined);

	return (
		<form className={styles.loginForm} action={submitLoginForm}>
			<label htmlFor="profileInput">Profile name:</label>
			<input
				id="profileInput"
				name="profileInput"
				type="text"
				required
				minLength={1}
				maxLength={256}
				defaultValue={existingProfileId ?? ""}
				onChange={(e) => doesProfileExist(e.target.value).then(setProfileExists)}
			/>
			<p>
				{profileExists
					? "A profile with this name already exists. Submit to login."
					: "No profile with this name exists. Submit to create it."}
			</p>
			<button type="submit">Submit</button>
		</form>
	);
};

export default LoginForm;
