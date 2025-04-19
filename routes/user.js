const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//Signup get route
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup post route
router.post("/signup",wrapAsync (async (req, res) => {
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderIn!");
            res.redirect("/listings");
        });    
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}));

// Login get route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login post route
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), async(req, res) => {
    req.flash("success","Welcome back to WanderIn!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You loggedout successfully");
        res.redirect("/listings"); 
    });
});

module.exports = router;