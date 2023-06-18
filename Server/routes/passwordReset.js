const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

// send password link
router.post("/", async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}/`;
		await sendEmail(user.email, "Password Reset", url);

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


// verify password reset link
router.get("/:id/:token", async (req, res) => {
	try {
	  const user = await User.findOne({ _id: req.params.id });
	  if (!user) return res.redirect("http://localhost:3000/404"); // Redirect to a 404 page in the frontend
  
	  const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	  });
	  if (!token) return res.redirect("http://localhost:3000/404"); // Redirect to a 404 page in the frontend
  
	  res.redirect(`http://localhost:3000/password-reset/${user._id}/${token.token}`); // Redirect to the frontend page for setting a new password
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  
  


// set new password
router.post("/api/password-reset/:id/:token", async (req, res) => {
	try {
	  const passwordSchema = Joi.object({
		password: passwordComplexity().required().label("Password"),
	  });
	  const { error } = passwordSchema.validate(req.body);
	  if (error)
		return res.status(400).send({ message: error.details[0].message });
  
	  const user = await User.findOne({ _id: req.params.id });
	  if (!user) return res.status(400).send({ message: "Invalid link" });
  
	  const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	  });
	  if (!token) return res.status(400).send({ message: "Invalid link" });
  
	  if (!user.verified) user.verified = true;
  
	  const salt = await bcrypt.genSalt(Number(process.env.SALT));
	  const hashPassword = await bcrypt.hash(req.body.password, salt);
  
	  user.password = hashPassword;
	  await user.save();
	  await token.remove();
  
	  // Redirect to the frontend page for setting a new password
	  res.redirect(`http://localhost:3000/password-reset/${user._id}/${token.token}`);
  
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  

//updating the password
  router.put("/:id/:token", async (req, res) => {
	try {
	  const { id, token } = req.params;
	  const { password } = req.body;
  
	  const user = await User.findOne({ _id: id });
	  if (!user) {
		return res.status(404).send({ message: "User not found" });
	  }
  
	  const passwordResetToken = await Token.findOne({ userId: id, token });
	  if (!passwordResetToken) {
		return res.status(404).send({ message: "Invalid or expired token" });
	  }
  
	  const salt = await bcrypt.genSalt(Number(process.env.SALT));
	  const hashPassword = await bcrypt.hash(password, salt);
  
	  // Update the user's password
	  user.password = hashPassword;
	  await user.save();
  
	  // Remove the password reset token
	  await passwordResetToken.remove();
  
	  res.status(200).send({ message: "Password reset successful" });
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
  module.exports = router;
  