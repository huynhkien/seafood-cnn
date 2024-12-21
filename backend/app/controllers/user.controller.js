const User = require('../models/user.model');
const Order = require('../models/order.model');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto-js');
const makeToken = require('uniqid');
const bcrypt = require('bcrypt');


const createRoleUser = asyncHandler(async(req, res) =>{
    const {email, name, phone, address, role} = req.body;
    const password = 123456789;
    const avatar = req.file ? req.file.path : null;

    if(!email || !name ||!phone || !address|| !role){
    return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin'
    })}
    req.body.password = password;
    if (avatar) req.body.avatar = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    const user = await User.findOne({email});
    if(user){
       throw new Error('Email đã được đăng ký !');
    }else{
        const html = `Tài khoản đã được đăng ký. Nhân viên cửa hàng đăng nhập tài khoản với email vaà mật khẩu là: '123456789'. Nhân viên có thay đổi hoặc giữ nguyên mật khẩu.` 
        await sendMail({email, html, subject: 'Hoàn tất đăng ký tài khoản'});
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: true,
            message: newUser ? 'Phân quyền người dùng thành công' : 'Gặp lỗi khi phân quyền người dùng'
        });
    }
       
});
const register = asyncHandler(async(req, res) => {
    const {email, password, name, phone,  address} = req.body;
    if(!email || !password || !name ||!phone ||!address)
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
        const user = await User.findOne({email});
       if(user) throw new Error('Emai đã tồn tại!');
       else{
        const token = makeToken();
        res.cookie('dataRegister',{ ...req.body, token}, {httpOnly: true, maxAge: 15*60*1000});        
        const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn sau 15 phút kể từ bây giờ.  
         <a href=${process.env.URL_SERVER}/api/user/final-register/${token}>Click here</a>` 
         await sendMail({email, html, subject: 'Hoàn tất đăng ký tài khoản'});
         return res.status(200).json({
            success: true,
            message: 'Vui lòng check mail để đăng ký tài khoản'
         })
        }
})
const registerApp = asyncHandler(async(req, res) => {
    const {email, password, name, phone,  address} = req.body;
    if(!email || !password || !name ||!phone ||!address)
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
        const user = await User.findOne({email});
       if(user) throw new Error('Emai đã tồn tại!');
       else{
        const token = makeToken();
        res.cookie('dataRegister',{ ...req.body, token}, {httpOnly: true, maxAge: 15*60*1000});        
        const html = 
                `
                <div>
                    <div>
                    Vui lòng copy mã token dưới đây. Mã token sẽ hết hạn trong vòng 15 phút nữa:
                    </div>
                    <div>
                    ${token}
                    </div>
                </div>.
                ` 
         await sendMail({email, html, subject: 'Hoàn tất đăng ký tài khoản'});
         return res.status(200).json({
            success: true,
            message: 'Vui lòng check mail để đăng ký tài khoản'
         })
        }
})
// const finalregister = asyncHandler(async(req, res) => {
//     const cookie = req.cookies;
//     const {token} = req.params;
//     if(!cookie || cookie?.dataRegister?.token !== token) 
//     res.clearCookie('finalregister');
//     return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`);
    
//     const newUser = await User.create({
//         email:cookie.dataRegister.email,
//         password:cookie.dataRegister.password,
//         phone:cookie.dataRegister.phone,
//         name:cookie.dataRegister.name,
// });
//     res.clearCookie('finalregister');
//     if(newUser) return res.redirect(`${process.env.URL_CLIENT}/finalregister/success`);
//     else {redirect(`${process.env.URL_CLIENT}/finalregister/failed`); }

// });
const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    const { token } = req.params;
    console.log(cookie?.dataRegister)
    
    if (!cookie || cookie?.dataRegister?.token !== token)  return res.redirect(`${process.env.URL_CLIENT}/final-register/failed`);
    res.clearCookie('dataRegister');
    const newUser = await User.create({
        email: cookie?.dataRegister?.email,
        password: cookie?.dataRegister?.password,
        phone: cookie?.dataRegister?.phone,
        name: cookie?.dataRegister?.name,
        address: cookie?.dataRegister?.address,

    });
    console.log(newUser);
    res.clearCookie('dataRegister');
        if (newUser) return res.redirect(`${process.env.URL_CLIENT}/final-register/success`);
        else return res.redirect(`${process.env.URL_CLIENT}/final-register/failed`);
        
});
const finalRegisterApp = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    const { token } = req.body;
    console.log(cookie?.dataRegister)
    
    if (!cookie){
        return res.status(401).json({
            success: false,
            message: 'Thiếu mã xác nhận',
        })
    }
    res.clearCookie('dataRegister');
    const newUser = await User.create({
        email: cookie?.dataRegister?.email,
        password: cookie?.dataRegister?.password,
        phone: cookie?.dataRegister?.phone,
        name: cookie?.dataRegister?.name,
        address: cookie?.dataRegister?.address,

    });
    console.log(newUser);
    res.clearCookie('dataRegister');
    if(newUser){
        return res.status(200).json({
            success: true,
            message: 'Đăng ký thành công',
        })
    }else{
        return res.status(401).json({
            success: false,
            message: 'Đăng ký thất bại'
        })
    }
        
});
const finalRegisterGoogle = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    const { token } = req.params;
    console.log( cookie?.dataRegisterGoogle)
    
    if (!cookie || cookie?.dataRegisterGoogle?.token !== token)  return res.redirect(`${process.env.URL_CLIENT}/final-register-google/failed`);
    res.clearCookie('dataRegisterGoogle');
    const newUser = await User.create({
        email: cookie?.dataRegisterGoogle?.email,
        password: cookie?.dataRegisterGoogle?.password,
        phone: cookie?.dataRegisterGoogle?.phone,
        name: cookie?.dataRegisterGoogle?.name,
        address: cookie?.dataRegisterGoogle?.address,

    });
    console.log(newUser);
    res.clearCookie('dataRegisterGoogle');
        if (newUser) return res.redirect(`${process.env.URL_CLIENT}/final-register-google/success`);
        else return res.redirect(`${process.env.URL_CLIENT}/final-register-google/failed`);
        
});

// refresh token -> dùng để cấp mới access token
// Access token -> xác thực, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin đăng nhập'
        });
    }
   
    const user = await User.findOne({ email });
    
    if (user && await user.isCorrectPassword(password)) {
        const { password, refreshToken, ...userData } = user.toObject();
        
        const accessToken = generateAccessToken(user._id, userData?.role);
        const newRefreshToken = generateRefreshToken(user._id);
        
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
        
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken,
            userData,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Tài khoản hoặc mật khẩu không chính xác'
        });
    }
});
const loginGoogle = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user) {
        const { password, refreshToken, ...userData } = user.toObject();
        
        const accessToken = generateAccessToken(user._id, userData?.role);
        const newRefreshToken = generateRefreshToken(user._id);
        
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
        
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            accessToken,
            userData,
        });
    } else {
        // Người dùng chưa tồn tại, tiến hành đăng ký
        const {email, type, name, phone, address, role, password} = req.body;
        const token = makeToken();
        res.cookie('dataRegisterGoogle',{ ...req.body, token}, {httpOnly: true, maxAge: 15*60*1000});           
        const html = `Mật khẩu sẽ được tự động tạo laà "123456789", khách hàng có thể thay đổi mật khẩu theo ý muốn. Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
         <a href=${process.env.URL_SERVER}/api/user/final-register-google/${token}>Click here</a>`; 
        await sendMail({email, html, subject: 'Hoàn tất đăng ký tài khoản'});
        return res.status(200).json({
            success: true,
            message: 'Vui lòng check mail để kích hoạt tài khoản'
        });
    }
});
const getCurrent= asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    const user = await User.findById(_id)
    return res.status(200).json({
        success: true,
        data: user ? user : 'Người dùng không tồn tại'
    })
       
});
const getUserId= asyncHandler(async(req, res) =>{
    const {uid} = req.params;
    const user = await User.findById(uid)
    return res.status(200).json({
        success: true,
        data: user
    })      
});

const reFreshAccessToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie && !cookie.reFreshToken) throw new Error('No refresh token in cookies!');
    
    jwt.verify(cookie.reFreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if(err) throw new Error('Invalid refresh token!');

        const response = await User.findOne({_id: decode._id, refreshToken: cookie.reFreshToken});
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched' 
        })
    })
}) 
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie || !cookie.reFreshToken) throw new Error('No refresh token cookies');
    // Xoas refresh token ở db
    await User.findOneAndUpdate({refreshToken: cookie.reFreshToken}, {refreshToken: ''}, {new: true} )
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('reFreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        message: 'Logout'
    })
})
// Client send mail
// server check email valid => send mail + password change token
// Client check mai => click link 
// Client send mail include token
// check token
//change password
const forgotPassword = asyncHandler(async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({
        success: false,
        message: "Thiếu thông tin"
    });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
        success: false,
        message: "Không tìm thấy địa chỉ email"
    });
    
    // Tạo reset token và lưu vào cơ sở dữ liệu
    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_CLIENT}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Queên mật khẩu'
    }
    const rs = await sendMail(data);
    return res.status(200).json({
        success: rs? false : true,
        message: rs? 'Vui lòng thử lại!' : 'Check mail của bạn'
    });

});
const forgotPasswordApp = asyncHandler(async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({
        success: false,
        message: "Thiếu thông tin"
    });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
        success: false,
        message: "Không tìm thấy địa chỉ email"
    });
    
    // Tạo reset token và lưu vào cơ sở dữ liệu
    const resetToken = user.createPasswordChangeToken();
    await user.save();
    const html = 
    `
    <div>
        <div>
        Vui lòng copy mã token dưới đây. Mã token sẽ hết hạn trong vòng 15 phút nữa:
        </div>
        <div>
        ${resetToken}
        </div>
    </div>.
    ` 
    const data = {
        email,
        html,
        subject: 'Forgot Password'
    }
    const rs = await sendMail(data);
    return res.status(200).json({
        success: rs? false : true,
        message: rs? 'Vui lòng thử lại' : 'Kiểm tra email để lấy mã token'
    });

});
const resetPassword = asyncHandler(async (req, res) =>{
    const {password, token} = req.body;
    if(!password || !token) throw new Error('Thiếu thông tin!')
    const passwordResetToken = crypto.SHA256(token).toString(crypto.enc.Hex);
    console.log(passwordResetToken)
    const user = await User.findOne({passwordResetToken, passwordResetExpires:{$gt: Date.now()}});
    if (!user) throw new Error('Thông tin không hợp lệ')
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Mật khẩu đã được cập nhật' : 'Gặp lỗi xảy ra trong quá trình cập nhaật'
    });

});

const getUsers = asyncHandler(async(req, res) => {
    const queries = {...req.query};
  // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el])

    // Định dạng lại các operatirs cho đúng cú pháp của moogose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const  formatQueries = JSON.parse(queryString);

    // Filtering 
    if(queries?.name) formatQueries.name = {$regex: queries.name, $options: 'i'}
    // if(req.query.Search) {
    //     query = {$or: [
    //         {name: {$regex: req.query.Search, $options: 'i'}},
    //         {email: {$regex: req.query.Search, $options: 'i'}}
    //     ]}
    // }
    if(req.query.Search) {
        delete formatQueries.Search;
        formatQueries['$or'] = [
            {name: {$regex: req.query.Search, $options: 'i'}},
            {email: {$regex: req.query.Search, $options: 'i'}},
           
         
        ]
    }
    let queryCommand = User.find(formatQueries);

    //sorting
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // Field Limiting
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    //
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);
 
    // Execute  \query
    const queryExecute = await queryCommand.exec();
    const counts = await User.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        userData: queryExecute,
        counts
    });
})
const deleteUsers = asyncHandler(async(req, res) => {
    const  {uid} = req.params;
    if(!uid) throw new Error('Not Find Id');
    const response = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `Tài khoản với email ${response.email} đã xóa thành công` : 'Xóa thất bại'
    })
})

const updateCurrent = asyncHandler(async(req, res) => {
    const  {_id} = req.user;
    const {name, email, phone, address} = req.body;
    const data = {name, email, phone, address}
    if(!_id || Object.keys(req.body).length === 0) throw new Error('Thiếu thông tin');
    const response = await User.findByIdAndUpdate(_id,data,{new: true}).select('-password -role');
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? `Tài khoản với ${response.email} đã được cập nhật` : 'Có lỗi xảy ra'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const {password} = req.body;
    const avatar = req.file ? req.file.path : null;

    // Cập nhật avatar nếu có
    if (avatar) {
        req.body.avatar = {
            url: req.file.path,
            public_id: req.file.filename,
        };
    }
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = await bcrypt.hash(password, salt);
    } else {
        delete req.body.password;
    }
    // Tìm và cập nhật thông tin người dùng
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true });

    // Kiểm tra xem người dùng có được cập nhật hay không
    if (!response) {
        return res.status(404).json({
            success: false,
            message: 'Người dùng không tồn tại.'
        });
    }

    const html = `Tài khoản đã được cập nhật. Nhân viên cửa hàng đăng nhập tài khoản với email và mật khẩu là: ${req.body.password}. Nhân viên có thể thay đổi hoặc giữ nguyên mật khẩu.`;
    await sendMail({ email: response.email, html, subject: 'Hoàn tất cập nhật tài khoản' });

    return res.status(200).json({
        success: true,
        message: response ? `Email ${response.email} đã được cập nhật` : 'Gặp vấn đề khi cập nhật'
    });
});


const updateByAdmin = asyncHandler(async(req, res) => {
    const {uid} = req.params;
    if(Object.keys(req.body).length === 0) throw new Error('Thiếu thông tin');
    const response = await User.findByIdAndUpdate(uid, req.body,{new: true}).select('-password -role');
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `Tài khoản với email ${response.email} đã được cập nhật` : 'Gặp vấn đề khi cập nhật'
    })

})

const updateAddress = asyncHandler(async(req, res) => {
    const  {_id} = req.user;
    if(!req.body.address) throw new Error('Missing Input');
    const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}},{new: true});
    return res.status(200).json({
        success: response ? true : false,
        updateAddress: response ? response : 'Cannot update address'
    })
})

// const updateCart = asyncHandler(async(req, res) => {
//     const {_id} = req.user;
//     const {pid, quantity = 1, variant, price, thumb, name} = req.body;
//     if(!pid || !quantity || !variant) throw new Error('Missing Inputs!');
//     const user = await User.findById(_id).select('cart');
//     const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.variant.toString() === variant);
//     if(alreadyProduct){
//         const response = await User.updateOne(
//             { cart: { $elemMatch: alreadyProduct } },
//             { $set: { 'cart.$.quantity': alreadyProduct.quantity + quantity, 'cart.$.variant': variant, 'cart.$.price': price, 'cart.$.thumb': thumb, 'cart.$.name': name  } },
//             { new: true }
//         );
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ?  'Added successfully' : "Not added successfully"
//         });
//     } else {
//         const response = await User.findByIdAndUpdate(
//             _id,
//             { $push: { cart: { product: pid, quantity, variant, price , thumb, name} } },
//             { new: true }
//         );
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ?  'Added successfully' : "Not added successfully"
//         });
//     }
// });
// const updateOneCart = asyncHandler(async(req, res) => {
//     const {_id} = req.user;
//     const {pid, quantity = 1, variant, price, thumb, name} = req.body;
//     if(!pid || !quantity || !variant) throw new Error('Missing Inputs!');
//     const user = await User.findById(_id).select('cart');
//     const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.variant.toString() === variant);
//     if(alreadyProduct){
//         const response = await User.updateOne(
//             { cart: { $elemMatch: alreadyProduct } },
//             { $set: { 'cart.$.quantity': quantity, 'cart.$.variant': variant, 'cart.$.price': price, 'cart.$.thumb': thumb , 'cart.$.name': name } },
//             { new: true }
//         );
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ?  'Added successfully' : "Not added successfully"
//         });
//     } else {
//         return res.status(404).json({
//             success: false,
//             mes: 'Not found product in cart'

//         });
//     }
// });
// const removeCart = asyncHandler(async(req, res) => {
//     const {_id} =req.user;
//     const {pid} = req.params;
//     const user = await User.findById(_id).select('cart');
//     const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid);
//     if(!alreadyProduct){
//         return res.status(404).json({
//             success: true,
//             mes: "No find cart"
//         })
//     }
//     const response = await User.findByIdAndUpdate(_id, {$pull: {cart: {product:pid}}}, {new : true});
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ? 'Deleted successfully' : 'Som thing went wrong'
//         })

// })
const getAllUsersWithOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        const userOrders = await Promise.all(orders.map(async order => {
            const user = await User.findById(order.orderBy).select('-cart -wishlist -role -password -isBlocked -createdAt -updatedAt');
            if (!user) {
                return null; 
            }
            return {
                user,
                order
            };
        }));
        const filteredUserOrders = userOrders.filter(item => item !== null);

        res.status(200).json({
            success: true,
            data: filteredUserOrders
        });
    } catch (error) {
        console.error('Error fetching users with orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
const updateWishList = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const alreadyInWishList = user.wishlist?.includes(pid);

    if (alreadyInWishList) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: pid } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? "Xóa sản phẩm khỏi danh sách yêu thích" : "Xóa thất bại!",
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: pid } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? "Thêm sản phẩm vào danh sách yêu thích" : "Thêm thất bại!",
        });
    }
});
// const removeAllCart = async (req, res) => {
//     const {_id}= req.user; 
//       const updatedCart = await User.findByIdAndUpdate(
//         _id,
//         { $set: { cart: [] } },
//         { new: true }
//       );
//       res.status(200).json({ 
//         success: updatedCart ? true : false, 
//         message: updatedCart
//     });
//   };

module.exports = {
    createRoleUser,
    register,
    finalRegister,
    login,
    getCurrent,
    reFreshAccessToken,
    logout,
    forgotPassword,
    forgotPasswordApp,
    resetPassword,
    getUsers,
    deleteUsers,
    updateCurrent,
    updateByAdmin,
    updateAddress,
    getAllUsersWithOrders,
    updateUser,
    getUserId,
    updateWishList,
    loginGoogle,
    finalRegisterGoogle,
    registerApp,
    finalRegisterApp
}
