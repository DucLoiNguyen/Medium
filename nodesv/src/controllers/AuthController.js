import account from "../models/AccountModel.js";

class AuthController {
    Login(req, res, next) {
        account
            .findOne({
            email: req.body.email,
            password: req.body.password
            })
            .then((data) => {
                if(data){
                    res.status(200).json({
                        message:"Login successfully",
                    })
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
            .catch((err) => res.status(500).json({
                message: err.message,
            }));
    }
}

export default new AuthController();