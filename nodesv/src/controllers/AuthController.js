import account from "../models/AccountModel.js";
import user from "../models/UserModel.js";

class AuthController {
    CheckAuth(req, res, next) {
        if (req.session && req.session.user) {
            console.log("nhay vao true");
            return res.status(200).json({
                isAuthenticated: true,
                user: req.session.user,
            });
        }
        return res.status(200).json({ isAuthenticated: false });
    }

    Login(req, res, next) {
        account
            .findOne({
            email: req.body.email,
            password: req.body.password
            })
            .then((data) => {
                if(data){
                    user.findOne({email: data.email})
                    .then((user) => {
                        console.log(user);
                        req.session.user = user;
                        res.status(200).json({
                            message:"Login successfully",
                        })
                    })
                    .catch((err)=>console.log(err));
                }else{
                    res.status(404).json({
                        message:"Not Found",
                    });
                }
            })
            .catch((err) => res.status(500).send(error));
    }

    Register(req, res, next) {
        const newAccount = new account(req.body);
        newAccount
            .save()
            .then((data) => res.status(200).json({
                message:"Register successfully",
            }))
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                message: err.message,
            })});
    }

    Logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Logout failed" });
            }
            res.status(200).json({ message: "Logout successful" });
        });
    }
}

export default new AuthController();