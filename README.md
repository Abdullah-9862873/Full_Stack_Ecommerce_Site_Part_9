# Full_Stack_Ecommerce_Site_Part_8
**Step 1:** Make two folders "frontend" and "backend"

**Step 2:** Inside backend create two files "app.js" and "server.js"

**Step 3:** Inside root directory open a terminal and type command, "npm init" and inside the entry point, type "backend/server.js"

**Step 4:** Install the packages "npm install mongoose express dotenv"

**Step 5:** Install the package "npm install nodemon"

**Step 6:** Setup the app.js file as
```

			const express = require("express");

			const app = express();

			module.exports = app;
```

**Step 7:** Setup the server.js file as
```
			const app = require("./app");

			app.listen(process.env.PORT, ()=>{
			    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
			})
```
**Step 8:** Make a folder inside "backend" by the name "config" and inside config, make a file "config.env" and inside config.env type
```
			PORT=4000
```
**Step 9:** Import dotenv in "server.js" file as:
```
			const dotenv = require("dotenv")
			dotenv.config({path:"backend/config/config.env"})
```
**Step 10:** Add the following inside the "package.json" file, inside the "script" and here if we run start then it will open it in using node and if we run dev then it will open it using nodemon and we will use dev in the development mode but in the production mode we use node
```
			    "start": "node backend/server.js",
			    "dev": "nodemon backend/server.js"
```
**Step 11:** Make two folders inside the "backend" named "routes" and "controllers"

**Step 12:** Inside the "routes" make a new file "productRoute.js" and inside the "controllers", make a new file named "productController.js"

**Step 13:** Inside the "productController.js", type the following
```
			exports.getAllProducts = (req, res) => {
 			   res.status(200).json({message: "route is working fine"});
			}
```
**Step 14:** Inside the "productRoute.js", type the following
```
			const express = require("express");
			const { getAllProducts } = require("../controllers/productController");

			const router = express.Router();

			router.route("/products").get(getAllProducts);

			module.exports = router;
```
**Step 15:** Import the Route in your "app.js" file  and now your app.js file will look like the following:
```
			const express = require("express");
			const app = express();

			app.use(express.json());

			// Route Import
			const product = require("./routes/productRoute");

			app.use("/api/v1",product)

			module.exports = app;
```			
**Step 16:** Now open the terminal and run the app in the dev mode by
```
			npm run dev
```
**Step 17:** Now go to the postman and make a new Collection named "Ecommerce"... Now click on the + option at the top left and make a get request to 
			http://localhost:4000/api/v1/products

	You'll see the message on the screen inside the postman that "server is working fine"

## Connecting Database

**Step 18:** Create a folder inside "config", named "database.js"

**Step 19:** Write the following code inside "database.js"
```
			const mongoose = require("mongoose");


			const connectDatabase = ()=>{
			    mongoose.connect(process.env.DB_URI).then((data)=>{
			        console.log(`MongoDB connected with server: ${data.connection.host}`);
			    }).catch((err)=>{
			            console.log(err);
			        })
			}

			module.exports = connectDatabase;

```
**Step 20:** Import the database inside the "server.js"
```
			const connectDatabase = require("./config/database");
```
**Step 21:** Run the connectDatabase function
```
			connectDatabase();
```
## models

**Step 22:** Make a new folder named "models" inside "backend" folder.

**Step 23:** Make a new file named "productModel.js" inside "models"

**Step 24:** Make a product Schema inside "productModels.js"
```
			const mongoose = require("mongoose");

			const productSchema = new mongoose.Schema({
			    name: {
			        type:String,
			        required:[true, "Please enter the name of product"],
			        trim:true
			    },
			    description: {
			        type: String,
			        required:[true, "Please enter the description of product"]
			    },
			    price: {
			        type: Number,
			        required:[true, "Please enter the price of product"],
			        maxLength:[8, "Price cannot exceed 8 characters"]
			    },
			    rating: {
			        type: Number,
			        default:0
			    },
			    images: [
			        {
			            public_id: {
			                type:String,
			                required:true
			            },
			            url: {
			                type:String,
			                required: true
			            }
			        }
			    ],
			    category: {
			        type: String,
			        required:[true, "Please enter product category"]
			    },
			    Stock: {
			        type: Number,
			        required: [true, "Please enter product stock"],
			        maxLength: [4, "Stock length cannot exceed 4 characters"],
			        default: 1
			    },
			    numOfReviews: {
			        type: Number,
			        default: 0
			    },
			    reviews: [
			        {
			            name: {
			                type: String,
			                required: true
			            },
			            rating: {
			                type: Number,
			                required: true
			            },
			            comment: {
			                type: String,
			                required: true
			            }
			        }
			    ],
			    createdAt: {
			        type: Date,
			        default: Date.now
			    }
			})

			module.exports = mongoose.model("Product", productSchema);
```
## createProduct

**Step 25:** Go to the "productController.js" inside "controllers" and type the following
```
				// Create Product --- Admin

				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);

				    res.status(201).json({
				        success: true,
				        product
				    })
				}
```
**Step 26:** Now the "productController.js" will be something like
```
				const Product = require("../models/productModel");

				// Create Product --- Admin

				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);
				
				    res.status(201).json({
				        success: true,
			        product
			    })
			}


				// Get All Products
				exports.getAllProducts = async (req, res) => {
				    const products = await Product.find();
			
				    res.status(200).json(
				        {
				            success: true,
				            products
				        }
				    )
				}
```
**Step 27:** Add a new router inside "productRoute.js" 
```
				router.route("/product/new").post(createProduct);
```

## Update Product

**Step 28:** Add the following in "productController.js" 
```
				// Update Product --- Admin

				exports.updateProduct = async (req, res, next) => {
				    let product = Product.findById(req.params.id);
				
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }

				    product = await Product.findByIdAndUpdate(req.params.id, req.body,
			        {
			            new: true,
			            runValidators: true,
			            userFindandModify: false
				})

				    res.status(200).json({
				        success: true,
				        product
				    })
				}
```
## Delete Product

**Step 29:** Add the following in "productController.js" 
```
				// Delete Product --- Admin

				exports.deleteProduct = async (req, res, next) => {
				    const product = await Product.findById(req.params.id);
		
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }
		
				    await product.remove();
			
				    res.status(200).json({
				        success: true,
				        message: "Product Deleted successfully"
				    })
				}
```
## Get Product Details

**Step 30:** Inside the "productController.js" type the following
```

				// Get Product Details
				exports.getProductDetails = async (req, res, next)=>{
				    const product = await Product.findById(req.params.id);

				    if(!product){
				        res.status(500).json({
				            success: false,
				            message: "Product not found"
				        })
				    }
			
				    res.status(200).json({
				        success: true,
				        product
				    })
				}
```
**Step 31:** Add the routes of the above insde the "productRoute.js" as
```				
				router.route("/products").get(getAllProducts);
				router.route("/product/new").post(createProduct);
				router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);
```
## Error Handling

**Step 32:** Make a folder named "utils" inside the "backend" folder and make a file named "errorhandler.js" inside it

**Step 33:** Type the following inside the file
```
				class ErrorHandler extends Error{
   				 constructor(message, statusCode){
				        super(message);
				        this.statusCode = statusCode;

				        Error.captureStackTrace(this, this.constructor);
				    }
				}

				module.exports = ErrorHandler;
```
**Step 34:** Make a new folder named "middleware" inside the backend and make a new file named "error.js" inside it

**Step 35:** Type the following inside the "error.js" file
```
				const ErrorHandler = require("../utils/errorhandler");

				module.exports = (err, req, res, next) => {
				    err.statusCode = err.statusCode || "500";
				    err.message = err.message || "Internal Server Error";
	
				    res.status(err.statusCode).json({
				        success: false,
				        //message: err.stack,
					message: err.message
				    })
				}
```
**Step 36:** Import the errorMiddleware inside the "app.js"
```
				const errorMiddleware = require("./middleware/error");
```
**Step 37:** Use the errorMiddleware inside the "app.js"... Remember to use it below "app.use("/api/v1",product)".
```
				app.use(errorMiddleware);
```
**Step 38:** Now you can go to the "productController.js" and update the files for example the "Get Product Details" will look like the following. But you have to import it to the "productController.js" file.
```
				const ErrorHandler = require("../utils/errorhandler");
				// Get Product Details
				exports.getProductDetails = async (req, res, next)=>{
				    const product = await Product.findById(req.params.id);

				    if(!product){
				        return next(new ErrorHandler("Product not Found", 404));
				    }
		
				    res.status(200).json({
				        success: true,
			        	product
				    })
				}
```
	Now if you don't give a valid product id while finding it or getting it then it will display the error accordingly

## Handling Async Errors

It is a good practice to write try and .catch inside async await functions. To avoid writing try and .catch again and again inside the product controller we'll make an error handler for it. 

**Step 39:** Make a new file inside the "middleware" named "catchAsynErrors.js" and add the following code into it.
```
				const catchAsyncErrors = theFunc => (req, res, next) => {
				    Promise.resolve(theFunc(req, res, next)).catch(next);
				}

				module.exports = catchAsyncErrors;
```			
**step 40:** Import it inside "productController.js".
```
				const catchAsyncErrors = require("../middleware/catchAsyncErrors");
```
**Step 41:** Now update the "productController.js".
```

	const Product = require("../models/productModel");
	const ErrorHandler = require("../utils/errorhandler");
	const catchAsyncErrors = require("../middleware/catchAsyncErrors");

	// Create Product --- Admin

	exports.createProduct = catchAsyncErrors(async (req, res, next)=> {
	    const product = await Product.create(req.body);

	    res.status(201).json({
	        success: true,
	        product
	    })
	});

	// Update Product --- Admin

	exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	    let product = Product.findById(req.params.id);

	    if(!product){
	        return res.status(500).json({
	            success:false,
	            message: "Product not found"
	        })
	    }
	
	    product = await Product.findByIdAndUpdate(req.params.id, req.body,
	        {
	            new: true,
	            runValidators: true,
	            userFindandModify: false
	        })
	
	    res.status(200).json({
	        success: true,
	        product
	    })	
	});
	
	// Delete Product --- Admin
	
	exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	    const product = await Product.findById(req.params.id);
	
	    if(!product){
	        return res.status(500).json({
	            success:false,
        	    message: "Product not found"
	        })
	    }
	
	    await product.remove();
	
	    res.status(200).json({
	        success: true,
	        message: "Product Deleted successfully"
	    })
	});
	
	// Get Product Details
	exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
	    const product = await Product.findById(req.params.id);
	
	    if(!product){
	        return next(new ErrorHandler("Product not Found", 404));
	    }
	
	    res.status(200).json({
	        success: true,
	        product
	    })
	});
	
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const products = await Product.find();
	
	    res.status(200).json(
	        {
	            success: true,
	            products
	        }
	    )
	});
```	
Now if you don't type the name or any required field while creating the product then it won't crash the server rather it will display the error

## Unhandled Promise Rejection


If we change the "DB_URI"  inside the "config.env" file to "mongodb://localhost:27017/Ecommerce" then it will throw an error and to resolve this we can make the following changes inside the "server.js"
We have to crash the Server 

**Step 42:** Inside the "server.js" update the app.listen to the following
```
	const server = app.listen(process.env.PORT, ()=>{
	    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
	})
```
**Step 43:** Inside the "server.js" write the following code at the end
```
	// Unhandled Promsie Rejection

	process.on("unhandledRejection", err => {
	    console.log(`Error: ${err.message}`);
	    console.log("Shutting down the server due to unhanlded rejection");

	server.close(()=> {
        	process.exit(1);
	    })
	})
```
**Step 44:** Now you can remove the ".catch" method inside "database.js" and your " database.js" will look like.
```
	const mongoose = require("mongoose");

	const connectDatabase = ()=>{
	    mongoose.connect(process.env.DB_URI).then((data)=>{
	        console.log(`MongoDB connected with server: ${data.connection.host}`);
	    })
	}

	module.exports = connectDatabase;
```
## Handling Uncaught Exception

If you type "console.log(youtube)" in your "server.js" then it will throw an error which says "youtube is not defined". These type of errors are called uncaught errors.

**Step 45:** Inside the "server.js" file at the top of the file, type the following code. It is important to write it in top because if you write it in bottom and you give **console.log(youtube)** above it then it will not catch that error
```
	// Uncaught Exception Error
	process.on("uncaughtException", err=>{
	    console.log(`Error: ${err.message}`);
	    console.log("Shutting down the server due to uncaught exception");
	    process.exit(1);
	})
```
## Handling Cast Error Mongodb
**Step 46:** If you give the less or more number of characters in the id then it will show you a cast error and to handle this error we can write the following code inside the "error.js" just below the line "err.message = err.message || "Internal Server Error";"
```
	// Mongodb Cast Error Handler
	    if(err.name === "CastError"){
	        const message = `Resource not found. Invalid ${err.path}`;
	        err = new ErrorHandler(message, 400);
	    }
```
## Searching Products by Name
**Step 47:** Make a new file inside "utils" named "apifeatures.js" and add the following code into it.
```
	class ApiFeatures {
	    constructor(query, queryStr){
	        this.query = query;
	        this.queryStr = queryStr;
	    }

	    search(){
	        const keyword = this.queryStr.keyword ? {
	            // Got the keyword
	            name: {
	                // We are searching for the name of the product
	                $regex: this.queryStr.keyword,
	                $options : "i",
	            },
	        } : {};
	
	        this.query = this.query.find({...keyword});
	        return this;
	    }
	}
	
	module.exports = ApiFeatures;
```
**Step 48:** Update the "getAllProducts" section of "productController.js".
```
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const apiFeature = new ApiFeatures(Product.find(), req.query).search();
	    const products = await apiFeature.query;

	    res.status(200).json(
	        {
        	    success: true,
	            products
	        }
	    )
	});
```
## Adding filter Section
**Step 49:** Add the following object below the search() object inside "ApiFeatures" class inside "apifeatures.js".
```
	    filter(){
	        const queryCopy = {...this.queryStr};
	        // Removing some fields for category
        	const removeFields = ["keyword", "page", "limit"];
	        removeFields.forEach(key=> {
	            delete queryCopy[key];
	        })

	        this.query = this.query.find(queryCopy);
	        return this;
	    }
```

Here we have made the copy of queryStr first and then stored the copy inside the queryCopy because we do not want to alter the real queryStr.
Also, the queryStr is an object which is {"category" : "something"} so no need to pass the queryCopy as an object inside this.query.find()
Also, this is case Sensitive so a category of "Laptop" will be searched as a "Laptop" only

**Step 50:** Update the "getAllProducts" of "productController.js".
```
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
	    const products = await apiFeature.query;
	
	    res.status(200).json(
	        {
	            success: true,
	            products
	        }
	    )
	});
```
## Filter for pricing and Rating

**Step 51:** To add the pricing and rating, update the filter() inisde the "apifeatures.js" as.
```
	filter(){
	        const queryCopy = {...this.queryStr};
	        // Removing some fields for category
	        const removeFields = ["keyword", "page", "limit"];
	        removeFields.forEach((key)=> {
	            delete queryCopy[key];
	        })
	
	        // Filter for pricing and rating
	        let queryStr = JSON.stringify(queryCopy);
	        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`);

	        this.query = this.query.find(JSON.parse(queryStr));
	        return this;
	    }
```

Now you can go to the postman and type the following
```
			KEY				VALUE
			keyword				product
			category			Laptop
			price[gt]			1200
			price[lt]			2000
```
And this will filter the products for you

## Pagination
**Step 52:** Make the following changes inside **"getAllProducts"** inside **"productController.js"**
```

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;

    res.status(200).json(
        {
            success: true,
            products
        }
    )
});
```
**Step 53:** Write the following code inside the **"ApiFeatures"** class inside **"apifeatures.js"**
```
    pagination(resultPerPage){
        const currentPage = this.queryStr.page;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
```
**currentPage** is the page where the user is, and **skip** is the number of objects to skip. Now you can create 10 products inside the **"create Product"** inside Postman and give the following inside **"KEY"** and **"VALUE"**

**Step 54:** Inside the "getAllProducts" section in "productController.js" write the following code below the "const resultPerPage = 5;"
```
			const productCount = await Product.countDocuments();
```

Also add the "productCount" as JSON in "getProductDetails" and update the "getProductDetails" as
```
	// Get Product Details
	exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
	    const product = await Product.findById(req.params.id);
	
	    if(!product){
	        return next(new ErrorHandler("Product not Found", 404));
	    }
	
	    res.status(200).json({
        	success: true,
	        product,
	        productCount
	    })
	});
```

## Backend User and Password Authentication

**Step 55:** Open the terminal and add the following packages into your workplace
```
			npm install bcryptjs jsonwebtoken validator nodemailer cookie-parser body-parser
```

**bcrypt:** is used to hash the passwords of users\
**validator:** is used to validate the user has entered the email and nothing else in the email section\
**nodemailer:** is used to send the OTP\
**cookie-parser:** is used to store the jsonwebtoken inside cookies\


**Step 56:** Inside the **"models"** folder. Make a new file named **"userModel.js"** and type the following code in it
```
	const mongoose = require("mongoose");
	const validator = require("validator");

	const userSchema = new mongoose.Schema({
	    name: {
	        type: String,
	        required: [true, "Please Enter your Name"],
	        maxLength: [30, "Name cannot exceed 30 characters"],
	        minLength: [4, "Name should have more than 4 characters"]
	    },
	    email: {
	        type: String,
	        required: [true, "Please Enter your Email"],
        	unique:true,
	        validate: [validator.isEmail, "Please Enter a valid Email"]
	    },
	    password: {
        	type: String,
	        required: [true, "Please Enter your Password"],
        	select: false,
	        minLength: [8, "Password should have more than 8 characters"]   
	    },	
	    avatar: {
	        public_id: {
        	    type: String,
	            required: true
	        },
	        url: {
	            type: String,
	            required: true
	        }
	    },
	    role: {
	        type: String,
        	default: "user"
	    },
	
	    resetPasswordToken: String,
	    restPasswordExpire: Date,
	})

	module.exports = mongoose.model("User",userSchema);
```

**Note:** Now here you can see that we used object in ***avatar***. And the reason is that in products case, you have alot of products but in case of\ profile picture you have only one so no need to make array.

## Register a User
**Step 57:** Make a new file named **"userController.js"** inside **"controllers"**

```
		const ErrorHandler = require("../utils/errorhandler");
	const catchAsyncErrors = require("../middleware/catchAsyncErrors");
	const User = require("../models/userModel");

	// Register a User
	exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	    const {name, email, password} = req.body;
	
	    const user = await User.create({
	        name, email,password, 
	        avatar: {
	            public_id: "This is a sample id",
	            url: "This is a sample url"
	        },
	    });
	
	    res.status(201).json({
	        success: true,
	        user
	    })
	})
```

**Step 58:** Make a new file named **"userRoute.js"** inside **"routes"** folder inside **"backend"**. Add the following code into it
```
	const express = require("express");
	const { registerUser } = require("../controllers/userController");

	const router = express.Router();

	router.route("/register").post(registerUser);

	module.exports = router;
```

**Step 59:** Go to the **"app.js"** file and add the following code below where the **"product"** route is imported
```
			const user = require("./routes/userRoute");
```

And add the following code into the same file below the **app.use("/api/v1",product)**
```
			app.use("/api/v1",user)
```

Now your **"app.js"** will look something like this
```
	const express = require("express");
	const app = express();
	const errorMiddleware = require("./middleware/error");

	app.use(express.json());

	// Route Import
	const product = require("./routes/productRoute");
	const user = require("./routes/userRoute");

	app.use("/api/v1",product)
	app.use("/api/v1", user)

	// Middleware for Errors

	app.use(errorMiddleware);

	module.exports = app;
```
## Hashing the Password
**Step 60:** Go to the **"userModel.js"** inside **"models"** and add the following code at the top:
```
			const bcrypt = require("bcryptjs")
```
**Step 61:** In the same file, above the *module.exports = mongoose.model("User",userSchema);* add the following code:
```
	userSchema.pre("save", async function(next){

	    if(!this.isModified("password")){
        	next();
	    }

	    this.password = await bcrypt.hash(this.password,10);
	})
```
In this code we have used **function** rather than a callback function and the reason is that we can use *this* inside the **function** but cannot use it inside **callback** function
*If* condition is showing that if the password is modified by the user then only hash it othervise leave it and in this way we'll save the code from hashing the hashed passwords.

**Step 62:** Go to the file **"userModel.js"** inside **"models"** folder and import the following
```
			const jwt = require("jsonwebtoken");
```

**Step 63:** In the same file type the following code at the end of the file just above *module.exports = mongoose.model("User",userSchema);*
```
	// JWT Token
	userSchema.methods.getJWTToken = function(){
	    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
	        expiresIn: process.env.JWT_EXPIRE,
	    });
	}
```

**Step 64:** Go to the **"config.env"** file inside the folder **"config"** and add the following into it
```
			JWT_SECRET=kajdsfjkasdfklhsdkfhkasdhfkasdfk
			JWT_EXPIRE=5d
```

**Step 65:** Go to the file **"userController.js"** inside the **"controllers"** folder and update the *res.status* inside the *Register the User*. The code for *Register the User* will look like
```
	// Register a User
	exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	    const {name, email, password} = req.body;

	    const user = await User.create({
	        name, email,password, 
	        avatar: {
	            public_id: "This is a sample id",
	            url: "This is a sample url"
	        },
	    });

	    const token = user.getJWTToken();

	    res.status(201).json({
	        success: true,
	        token
	    })
	})
```
Now when you create a user using Post request inside the postman then it will not show the user rather it will show you the token generated for that user

## Login User
**Step 66:** Go to the **"userController.js"** file inside the folder **"controllers"** and add the following code at the end of file
```
	// Login User
	exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	    const {email, password} = req.body;

	    // Check if the user has entered Email and Password both
	    if(!email || !password){
	        next(new ErrorHandler("Please Enter Email & Password", 400));
	    }
	
	    const user = await User.findOne({email}).select("+password");
	
	    if(!user){
	        next(new ErrorHandler("Invalid email or password", 401));
	    }
	
	    const isPasswordMatched = user.comparePassword(password);
	
	    if(!user){
	        next(new ErrorHandler("Invalid email or password", 401));
	    }
	
	    const token = user.getJWTToken();
	
	    res.status(200).json({
	        success: true,
	        token
	    })
	})
```

*400*: Bad Request Error\
*401*: Unautorized\

In this code ***.select("+password")*** is used because while creating the user Model we have make the password to ***select false*** so here we have to mannually select it\
First we check if the user is present and then we get the password and compare it with the database\

**Step 67:** Go to the **"userModel.js"** inside the folder **"models"** and type the following code above the *module.exports = mongoose.model("User",userSchema);*
```
	// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
```

**Step 68:** Go to the **"userRoute.js"** inside the folder **"routes"** and add the following route into it
```
				router.route("/login").post(loginUser);
```
Also you have to import the *loginUser* like
```
	const { registerUser, loginUser } = require("../controllers/userController");
```

**Step 67:** Now you don't have to write the following code again and again in the userController.js
```
	    const token = user.getJWTToken();

    		res.status(200).json({
	        	success: true,
	        	token
		    })
```

Rather make a new file named **"jwtToken.js"** in the **"utils"** folder and write the following code in it
```
		// Creating Token and Saving in cookie

	const sendToken = (user, statusCode, res)=>{
	    const token = user.getJWTToken();
	
	    // options for cookie
	    const options = {
	        expire: new Date(
	            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
	        ),
	        httpsOnly:true,
	    };
	    res.status(statusCode).cookie("token",token, options).json({
	        success:true,
	        user,
	        token
	    })
	}

	module.exports = sendToken;
```
Here the httpsOnly shows that the token can be accessed via browser only and no where else

Now go to the **"userController.js"** file in the **"controllers"** folder and import it first by
```
		const sendToken = require("../utils/jwtToken");
```

After importing replace the upper code from **"Register the user"** to the following
```
		sendToken(user, 201, res);
```

And replace the upper code from **"Login User"** to the following 
```
		sendToken(user,200, res);
```

Now the final **"userController.js"** will look like
```
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register the User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email,password, 
        avatar: {
            public_id: "This is a sample id",
            url: "This is a sample url"
        },
    });

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    // Check if the user has entered Email and Password both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user,200, res);
})
```
**Step 68:** Add the following into the **"config.env"** file inside the "config" folder"
```
	COOKIE_EXPIRE=5
```
Now when you send the ***Login User*** request in postman then it will show you the results in body and cookie in cookie

**Step 69:** To make the logged in user, access something let's say "getAllProducts", we make a new file named **"auth.js"** inside **"middleware"** folder and write the following code in it
```
	const catchAsyncErrors = require("./catchAsyncErrors");

	exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next)=> {
	    const token = req.cookies;
	    console.log(token);    
	})
```
Now go to the **"productRoute.js"** and import the *isAuthenticatedUser* as:
```
			const { isAuthenticatedUser } = require("../middleware/auth");
```
Now update the products route into the following
```
			router.route("/products").get(isAuthenticatedUser, getAllProducts);
```

**Step 70:** Now go to the **"app.js"** and add the following code below the ***app.use(express.json())***
```
			const cookieParser = require("cookie-parser");
```

Now you can go to the postman and go to the getProductDetails and send the Get Request and this will print the token in the console

**Step 71:** Completion of **"auth.js"** is in the following
```
	const jwt = require("jsonwebtoken");
	const ErrorHandler = require("../utils/errorhandler");
	const catchAsyncErrors = require("./catchAsyncErrors");
	const User = require("../models/userModel");
	
	exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next)=> {
	    const {token} = req.cookies;
	    
	    if(!token){
	        next(new ErrorHandler("Please login to access this resource", 401));
	    }
	
	    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
	
	    req.user = await User.findById(decodedData.id);
	    next();
	})
```
*{token}* gives the value of token in the console but the *token* gives the output like ***{"token": "value"}***\
*jwt.verify* is used to verify that the token and the JWT_SECRET is present and authentic or not.\
The *id* in decodedData is coming from the id that it got while making the *JWT Token* in the *userModel.js*\

## Logout User
**Step 72:** Go to the ***"userController.js"*** and add the following code at the end of the file
```
	// Logout User

	exports.logout = catchAsyncErrors(async (req, res, next)=> {
	    res.cookie("token", null, {
	        expires: new Date(Date.now()),
	        httpOnly: true,
	    });
	
	    res.status(200).json({
	        success: true,
	        message: "Logged Out"
	    })
	})
```

Now go to the ***"userRouter.js"*** and add the following route into it
```
	router.route("/logout").get(logout);
```

You also have to import it inside the ***"userRouter.js"*** as
```
	const { registerUser, loginUser, logout } = require("../controllers/userController");
```

Now if you go to the postman and make a new file with a get request named "Logout User" and you run it... \
This will make the cookie to be null and thus the user is logged out.\
Now if you make a get request on ***"getAllProducts"*** inside postman then this will not show you the products\

**Step 73:** To make the website secure, go to the ***"productRoute.js"*** and add the **isAuthenticatedUser** inside ***"update and delete"*** thus the total code will look like
```
	const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getAllProducts);
router.route("/product/new").post(isAuthenticatedUser, createProduct);
router.route("/product/:id").put(isAuthenticatedUser, updateProduct).delete(isAuthenticatedUser, deleteProduct).get(getProductDetails);

module.exports = router;
```

**Step 74:** To make the admin only to getProductDetails we have to make some changes inside **"auth.js"**. Go to the **"auth.js"** inside **"middleware"** folder and add the following code at the end of it
```
// Authorize Roles
exports.authorizeRoles = (...roles)=>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }

        next();
    }
}
```
\
***403:*** shows that server know what you are doing but it is rejecting the access\

**Step 75:** Go to the **"productRoute.js"** inside the **'routes"** folder and update the ***router.route("/products")*** as
```
	router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);
```

Now if you go to the postman and get the product details after loggin in then it will decline it.\
As the role of the user inside the database is "user"\
If you change it inside "MongoDB" to ***admin*** then you can access the products

**Step 76:** To make the confusion between the admins to minimum that which admin has created a user.\
Go to the ***"productModel.js"*** and add the following code just above the ***cretedAt*** at the bottom
```
    user: {
        type:mongoose.Schema.ObjectId,
        required:true,
        ref: "User"
    },
```

Now go to the ***"productController.js"*** where we made the "createProduct" and update the ***createProduct*** as:
```
// Create Product --- Admin

exports.createProduct = catchAsyncErrors(async (req, res, next)=> {
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});
```

Here ***req.body.user*** will give us the user and we'll assign it to the value of id. Remember when we created Login function then we assigned the user an id\
This is that id.

## Password Reset or Forget

**Step 77:** Go to the ***"userModel.js"*** and add the following code into it just above the ***module.exports = mongoose.model("User",userSchema);***:
```
// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Token Expire Time
    this.restPasswordExpire = Date.now() + 15 *60 * 1000;

    return resetToken;
}
```
**Step 78:** Go to the **"userController.js"** and add the following code into it at the end\
```
// Forget Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    // Get Passowrd Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    // Creating a link to send through the mail
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you don't have requested to reset your password then please ignore it`;

    try{
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message: message,
        })

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
})
```

Here we have saved the resetPasswordToken and resetPasswordExpire to database, so we have to set them undefined\
Also we have to save the user again after it\
You have to import the ***sendEmail*** into ***userController.js*** by
```
const sendEmail = require("../utils/sendEmail");
```

**Step 79:** Now make a new file named **"sendEmail.js"** inside the **"utils"** folder and add the following code into it

```
const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure:true,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
```

**Step 80:** Now go to the ***"config.env"*** and add the following things inside 
```
SMPT_SERVICE=gmail
SMPT_MAIL= mymailforproject12@gmail.com
SMPT_PASSWORD= "gvuzknqyxqtzajhy"
SMPT_HOST= "smpt.gmail.com"
SMPT_PORT= 465
```

***SMPT_PASSWORD*** is actually not my mail password. \
It's the password that I set inside the app password after enabling 2 factor authentication for this mail account\
Now you can go to the ***postman*** and make a ***POST*** request with the address ***http://localhost:4000/api/v1/password/forgot*** and add the following inside **body** -> **raw** -> **JSON**
```
{
    "email": "ag2@youtube.com"
}
```
\n
Now go to the mail and go to the ***sent*** section and you'll see that the mail with a token has been sent to the required user...\

## Reset Password

**Step81:*** Go to the **"userController.js"** inside the **"controllers"** folder and import **crypto** in it...
```
	const crypto = require("crypto");
```

Now add the following code at the end of it:
```
		// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next)=> {

    // Creating Token Hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire : {$gt: Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});
```

**Step82:** Now go to the **"userRoutes.js"** inside the **"routes"** folder and add the following route in it
```
	router.route("/password/reset/:token").put(resetPassword);
```

You have to import it too as
```
	const { registerUser, loginUser, logout, forgotPassword, resetPassword } = require("../controllers/userController");
```

Now you can go to the postman and paste the token that you sent to the user via mail. And make a **PUT** request but you have to write the **password** and **confirmPassword** inside the body as
```
	{
    "password": "thisisnewpassword",
    "confirmPassword": "thisisnewpassword"
}
```

## Mongoose Duplicate Error Handling

**Step 83:** To handle the error where the user has registered again with the same email. Go to the **"error.js"** inside **middleware**. Add the following code inside the **module.exports** just above the **res.status**\
```
    // Mongoose duplicate Key Error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
```
**Step 84:** To handle the ***Json Web Token Error*** add the following at the same file below the ***Mongoose duplicate Key Error***
```
    // Wrong JWT Error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }
```
**Step 85:** To handle ***Json Expire Error*** add the following code at the same file below the ***Wrong JWT ERror***
```
	// JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired, Try again`;
        err = new ErrorHanlder(message, 400);
    }
```

Now the final **"error.js"** file will look like the following
```
const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongodb Cast Error Handler
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate Key Error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT Error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired, Try again`;
        err = new ErrorHanlder(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
```

## User Route Api

**Step 86:** If a user wants his own details, then we have to make a function named ***getUserDetails***. \
For that, go to the **"userController.js"** inside the **"controllers"** folder and add the following code at the end of the file\

```
// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})
```
\

Now go to the **"userRoute.js"** and add the following code into it:
```
router.route("/me").get(isAuthenticatedUser, getUserDetails)
```
\
Also you have to import the following into the **"userRoute.js"**

```
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")
```
\
Now you can go to the postman and add the route with me and make a ***GET*** request and see if you gets the user

## Update / Change Password

**Step 87:** Go to the **"userController.js"** inside it add the following code at the end:
```
// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect", 401));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.newPassword;

    user.save();

    sendToken(user,200,res);
})
```
\
Now go to the **"userRoute.js"** inside the **"routes"*** folder and add the following route
```
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
```
\
Now you can go to the postman and make a ***PUT*** request but you have to give the ***old*** ***new*** and ***confirmPassword*** at  the ***body*** as
```
{
    "oldPassword": "thisisnewpassword",
    "newPassword": "thisischangedpassword",
    "confirmPassword": "thisischangedpassword"
}
```

## Update Profile

**Step 88:** Go to the **"userController.js"** inside the **"controllers"** folder and add the following code at the end
```
// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // We'll add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindandModify: false,
    })

    user.save();

    res.status(200).json({
        success: true
    })
})
```
\
Now go to the **"userRoute.js"** and add the following route and also import it
```
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
```
\
Now you can go to the postman and make a ***PUT*** request to the ***http://localhost:4000/api/v1/me/update*** but you have to give the following details inside ***raw*** -> ***json***
```
{
    "name": "temp",
    "email": "temp@gmail.com"
}
```

**Step 89:** Go to the **"productRoute.js"** and update it as the following
```
const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { route } = require("./userRoute");

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, updateProduct).delete(isAuthenticatedUser, deleteProduct);

route.route("/product/:id").get(getProductDetails);

module.exports = router;
```
\
Here we have made the changed as the ***admin*** can create the produdct, delete and update the product\
But the user can get produdct details and getAllProducts

## GetAllUsers and GetSingleUser --- Admin

**Step 90:** Go to the **"userController.js"** and add the following code at the end;:
```
// Get all users --Admin
exports.getAllUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
})

// Get Single User -- Admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user
    })
})
```
\
Now go to the **"userRoute.js"** and add the following routes and import them
```
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
```
\
Now you can go to the postman and make ***GET*** request on the path

## Update User Role

**Step 91:** Go to the **"userController.js"** and add the following code at the end:
```
// Update User Role --- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exisit with id ${req.params.id}`, 400)); 
    }

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindandModify: false,
    })

    res.status(200).json({
        success:true,
        user
    })
})
```
\
Now go to the **"userRoute.js"** inside the **"routes"** folder and add the following route in it
```
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
```

## Delete User or Admin

**Step 92:** Go to the **"userController.js"** and add the following code into it at the end
```
// Delete User --- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next)=> {
    const user = await User.findById(req.params.id);

    // Remove Cloudinary Here

    if(!user){
        return next(new ErrorHandler(`User does not exisit with id ${req.params.id}`, 400)); 
    };

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    })
})

```
\
Now go to the **"userRoute.js"** and update the previous route to the following:
```
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
```
\
Also import them\
Now you can test them in postman

## Create new review or update the review

**Step 93:** Go to the **"productController.js"** and add the following code into it
```
// Create New Review or Update the Review
exports.createProductReview = catchAsyncErrors(async (req, res, next)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    })

    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    });
})

```
\
**Step 94:** Go to the **"productModel.js"** and change the ***rating*** under price to ***ratings*** and change the ***reviews*** and add ***user*** in it.\
Your ***reviews*** will look like the following:\
```
reviews: [
        {
            user: {
                type:mongoose.Schema.ObjectId,
                required:true,
                ref: "User"
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
```
**Step 95:** Now go to the **"productRoute.js"** and add the following route
```
router.route("/review").put(isAuthenticatedUser, createProductReview);
```
And import the createProductReview too and now you can go to the ***postman*** and make a put request on the path but you have to give the following inside the ***body*** 
```
{
    "productId": "63737d300188ec3584914df9",
    "comment": "Just Okay",
    "rating": "4"
}
```
Here id is the id of product that you'll generate... Generate a new product for simplicity

## Get all reviews of a product

**Step 96:** Go to the **"productController.js"** and add the following code into it at the end
```
// Get All Reviews of Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 400));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    })
});
```

## Delete Reviews of a Product
**Step 97:** Go to the **"productController.js"** and add the following code into it at the end:
```
// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next)=> {
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews =  product.reviews.filter((rev) => {
        rev._id.toString() === req.query.id;
    })

    product.reviews.pop(reviews);

    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating;
    })

    product.reviews.ratings = avg / product.reviews.length;

    product.numOfReviews = product.reviews.length;

    await product.save({validateBeforeSave: false});
    
    res.status(200).json({
        success: true,
    });
})
```

**Step 98:** Go to the **"productRoute.js"** and add the following route into it:
```
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);
```
Now you can test the code in ***postman***.\
Go to the postman and make a new file and make a ***GET*** request on ***http://localhost:4000/api/v1/reviews?id=(Put id here)*** where id will be written as
```
			KEY			VALUE
			id			Here put the id
```

And you can test it.\

Also to test ***Delete Review*** Make a new file on postmand and make a ***DELETE*** request to ***http://localhost:4000/api/v1/reviews?productId=(put product id here)&id=(put review id here)***\
Where you can enter the both as
```
			KEY			VALUE
			id			(Put review id here)
			productId		(Put productId here)
```

**Step 99:** Go to **"models"** folder and create a new file named **"orderModel.js"** and type the following code in it:
```
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    paidAt: {
        type: Date,
        required: true,
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt:Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
```
## Order Create

**Step 100:** Go to the **"controllers"** folder and make a new file named **"orderController.js"** in it and add the following code into it:
```
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
})
```

**Step 101:** Now go to the **"routes"** folder and make a new file named **"orderRoute.js"** and add the following code into it
```
const express = require("express");
const { newOrder } = require("../controllers/orderController");
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

module.exports = router;
```

**Step 102:** Now go to the **"app.js"** and add the following things into the file:
```
const order = require("./routes/orderRoute");
```
\
```
app.use("/api/v1", order)
```
\
You can go to the **postman** and make a new order on the required route by putting the **POST** request on **http://localhost:4000/api/v1/order/new** and you need to write the following JSON on **BODY** -> **raw** -> **JSON**
```
{
    "itemsPrice": 200,
    "taxPrice": 36,
    "shippingPrice": 100,
    "totalPrice": 336,
    "orderItems": [
        {
            "product":"63748d229156ca3e8e2d7756",
            "name": "Test",
            "price": 1900,
            "image": "Sample Image",
            "quantity": 1
        }
    ],
    "shippingInfo": {
        "address": "619 Los Angeles",
        "city": "LA",
        "state": "California",
        "country": "Pakistan",
        "pinCode": 400001,
        "phoneNo": 123456789
    },
    "paymentInfo": {
        "id": "Sample Payment Info",
        "status": "Succeeded"
    }
}
```

**Step 103:** Go to the **"orderController.js"** and add the following code at the end:
```
// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
})

// Get Logged in user's orders
exports.myOrders = catchAsyncErrors(async (req, res, next)=> {
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    });
});
```
\
Here **populate** is used to put the **name** and **email** of logged in user into **user** portion inside orderDetails
\

## Get All Orders -- Admin
**Step 104:** Go to the **"orderController.js"** and add the following code at the end:
```
// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});
```

**Step 105:** Go to the **"userRoute.js"** and add the following routes:
```
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
```
\
```
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
```
\
Now you can go to the postman and make a **GET** request on **http://localhost:4000/api/v1/orders/me** to get the orders of the user that is logged in\
And you can make a **GET** request on **http://localhost:4000/api/v1/order/(Order id here)** to get the single order\
\

## Update Order Status --- Admin
**Step 106:** Go to the **"userController.js"** and add the following code into it at the end
```
// Update Order Status --- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next)=> {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    })

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        message: "Order Updated Successfully",
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave: false});
}
```

**"Step 107:** Add the following code at the end of **"usercontroller.js"** file
```
// Delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 400));
    }

    await order.remove();
    
    res.status(200).json({
        success: true,
    });
})
```

Add the following routes inside **"userRoute.js"** \
```
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
```
So the **orderRoute.js** is given as:
```
const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
```
**Step 108:** Now you can check these functionalities inside the **postman**\
Make a new file inside the postman and make a **PUT** request on **http://localhost:4000/api/v1/admin/order/(Order id here)**\
And make a **DELETE** request on **http://localhost:4000/api/v1/admin/order/(Order id here)**\


# Frontend
**Step 109:** Close the terminal by **Ctrl + C** and go to the frontend file
```
		cd ./frontend/
```

Now install the **react app** by putting following command on terminal
```
		npx create-react-app .
```
\
Now you can go to the terminal and type **npm start** to start the react app

**Step 110:** Install the required packages by putting the following code inside terminal
```
npm config set legacy-peer-deps true
```
\
```
npm i axios react-alert react-alert-template-basic react-helmet react-redux redux redux-thunk redux-devtools-extension react-router-dom overlay-navbar
```
\

**Step 111:*** Now make the following changes inside files\
Go to **"src** folder inside **"frontend"** and then delete all the files except **"index.js"** **"App.js"** and **"App.css"**\

Now make some changes such that the files look like the following\
**index.js**\
\
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
\
**App.js**\
```
import logo from './logo.svg';
import './App.css';

function App() {
  
}

export default App;
```
\
**App.css** would be **empty**
\
**Step 112:** Go to the **"public"** folder and delete all the comments inside the **"index.js"** file
\
**Step 113:** Go to the **"src"** folder and make a new folder named **"components"** and inside it make a new folder named **"layoyut"** and inside it make a new file named **"Header.js"** and inside it type the following command
```
rafce
```
\
This is the emmet and gives you the code
**Step 114:** Import this **Header.js** inside the **"App.js"** file by 
```
import Header from "./component/layout/Header.js"
```
And type the following inside the ""*function App"**\
```
<Header />
```

## Overlay Navbar

**Step 115:** Install **react-icons** to use the **overlay-navbar** by using the following command:
```
npm install react-icons
```
\
And remember you are inside the frontend folder by **cd ./frontend/**\
Now install **overlay-navbar** by\
```
npm install overlay-navbar
```
\
**Step 116:** Go to the **"Header.js"** and import the **overlay-navbar** as
```
import {ReactNavbar} from "overlay-navbar"
```
And **return <ReactNavbar />** inside the **Header** function\

**Step 117:** Go to the **"App.js"** file and import the **react-router-dom** inside the file
```
import {BrowserRouter as Router} from "react-router-dom"
```
And type the following code inside the **App** function
```
  return <Router>
    <Header />
  </Router>
```
Now go to the terminal and type **npm start** and you can see overlay-navbar on the browser\

**Step 118:** Go to the **"Header.js"** inside **src/component/layout** and type the code so that the final **Header.js** file will look like the following
```
import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../images/logo.png";
import {MdAccountCircle } from "react-icons/md";
import {MdSearch } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";

const options = {
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIcon:true,
  profileIconColor: "rgba(35, 35, 35,0.8)",
  ProfileIconElement: MdAccountCircle, 
  searchIcon:true,
  searchIconColor: "rgba(35, 35, 35,0.8)",
  SearchIconElement:MdSearch,
  cartIcon:true,
  cartIconColor: "rgba(35, 35, 35,0.8)",
  CartIconElement:MdAddShoppingCart,
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  cartIconMargin: "1vmax",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;
```
\ 
**App.js** file looks like the following:\
```
import './App.css';
import Header from "./component/layout/Header.js"
import {BrowserRouter as Router} from "react-router-dom"

function App() {
  return <Router>
    <Header />
  </Router>
}

export default App;
```
\
**index.js** file will look like the following:
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
\
## font loader
**Step 119:** Go to the terminal and go to the frontend folder by **cd ./frontend/** now type the following command:
```
npm install webfontloader
```
\
**Step 120:** Type the following command inside **App.js**
```
import WebFont from "webfontloader";
import React from "react"
```
\
Add the following inside the **App.js** file inside **function App(){}**, above the **return **
```
React.useEffect(()=>{
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
  }, []);
```
\
## Footer
**Step 121:** Make a new folder named **Footer** inside the **component** -> **layout**\
Now make a new file named **Footer.js* and **Footer.css** inside the **Footer** app\
Type the following code inside **App.js**
```
import React from "react";
import "./Footer.css"
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";

const Footer = () => {
  return (
    <footer id="footer">
        <div class="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phones</p>
            <img src={playStore} alt="playStore" />
            <img src={appStore} alt="AppStore" />
        </div>
        <div class="midFooter">
            <h1>ECOMMERCE</h1>
            <p>High Quality is out first priority</p>

            <p>Copyrights 2021 &copy; Abdullah</p>
        </div>
        <div class="rightFooter">
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/ab__02_/">Instagram</a>            
            <a href="https://www.instagram.com/ab__02_/">Youtube</a>            
            <a href="https://www.instagram.com/ab__02_/">Facebook</a>            

        </div>
    </footer>
  );
};

export default Footer;
```
**Step 121:** Type the following code inside **Footer.css*\
```
footer {
    margin-top: 10vmax;
    padding: 2vmax;
    background-color: rgb(34, 33, 33);
    color: white;
    display: flex;
    align-items: center;
}

/* Left Footer */

.leftFooter {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.leftFooter > h4 {
    font-size: 1vmax;
    font-family: 'Roboto';
}
.leftFooter > p {
    text-align: center;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1.2vmax;
}
.leftFooter > img {
    width: 10vmax;
    margin: 1vmax;
    cursor: pointer;
}

/* Mid Footer */
.midFooter {
    width: 60%;
    text-align: center;
}
.midFooter > h1{
    font-size: 4vmax;
    font-family: 'Roboto';
    color: #eb4034;
}
.midFooter > p {
    max-width: 60%;
    margin: 1vmax auto;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

/* Right Footer */
.rightFooter {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.rightFooter > h4 {
    font-family: 'Roboto';
    font-size: 1.4vmax;
    text-decoration: underline;
}
.rightFooter > a {
    text-decoration: none;
    font-size: 1.3vmax;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: white;
    margin: 0.5vmax;
    transition: all 0.5s;
}
.rightFooter > a:hover {
    color: #eb4034;
}
```

## Designing Home Page
**Step 122:** Make a new file named **Home.js** inside the **Home** folder inside the **components** and type the following code
```
import React, { Fragment } from "react";
import "./Home.css"

const Home = () => {
  return (
    <Fragment>
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>

        <a href="#container">
          <button>
            Scroll 
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
    </Fragment>
  )
};

export default Home;
```
**Step 123: ** Make a new file named **Home.css** inside the **Home** folder inside **components** folder and type the following code inside:
```
.banner {
    background-image: linear-gradient(#FFA384, #74BDCC);
    height: 100vmin;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    color: white;
}

.banner > h1 {
    margin: 5vmax;

    font: 600 2.5vmax "Roboto";
}

.banner > p {
    font: 300 1.4vmax "Lucida Sans";
}

.banner > a > button {
    margin-bottom: 5vmax;
    cursor: pointer;
    background-color: white;
    border: 1px solid white;
    border-radius: 0;
    padding: 1vmax;
    transition: all 0.5s;
    width: 9vmax;
    font: 500 1vmax "Roboto";
}
.banner > a > button:hover {
    background-color: rgba(255, 255, 255, 0);
    color: white;
}
.banner::after {
    content: "";
    width: 100vw;
    height: 100vmin;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(100% 76%, 0 100%, 100% 100%);
    max-width: 100%;
}

.homeHeading {
    text-align: center;
    font-family: Roboto;
    font-size: 1.4vmax;
    border-bottom: 1px solid rgba(21, 21, 21, 0.5);
    width: 20vmax;
    padding: 1vmax;
    margin: 5vmax auto;
    color: rgba(0,0,0,0.7);
    
}
```

**Step 124:** Now we have to make the products component and to do this make a new file named **Product.js** inside **Home** folder inside **components** and type the following code inside:
```
import React from "react";
import {Link} from "react-router-dom";

const Product = () => {
    return <div></div>
}

export default Product
```

**Step 125: ** Install the following package inside the terminal:
```
npm install react-rating-stars-component
```

Also import **Product** inside the **Home.js** file by typing the following code:
```
import Product from "./Product";
```

And use it inside the **Fragment** section as:
```
<div className="container" id="container">
        <Product product={product}/>
      </div>
```
Just below the **Featured Products** section

**Step 126: ** Inside the **Product.js** add the following code:
```
import React from "react";
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: 2.5,
    isHalf: true,
};

const Product = ({product}) => {
    return (
        <Link className="productCard" to={product._id}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} /> <span>(256 Reviews)</span>
            </div>
            <span>{product.price}</span>
        </Link>
    );
};

export default Product
``` 
**Step 127:** Inside the **App.css** file inside **src** add the following code:
```
* {
    margin: 0;
    scroll-behavior: smooth;
}
```

**Step 128:** Inside the **Home.css** file add the following code:
```
.banner {
    background-image: linear-gradient(#FFA384, #74BDCC);
    height: 100vmin;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    color: white;
}

.banner > h1 {
    margin: 5vmax;

    font: 600 2.5vmax "Roboto";
}

.banner > p {
    font: 300 1.4vmax "Lucida Sans";
}

.banner > a > button {
    margin-bottom: 5vmax;
    cursor: pointer;
    background-color: white;
    border: 1px solid white;
    border-radius: 0;
    padding: 1vmax;
    transition: all 0.5s;
    width: 9vmax;
    font: 500 1vmax "Roboto";
}
.banner > a > button:hover {
    background-color: rgba(255, 255, 255, 0);
    color: white;
}
.banner::after {
    content: "";
    width: 100vw;
    height: 100vmin;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(100% 76%, 0 100%, 100% 100%);
    max-width: 100%;
}

.homeHeading {
    text-align: center;
    font-family: Roboto;
    font-size: 1.4vmax;
    border-bottom: 1px solid rgba(21, 21, 21, 0.5);
    width: 20vmax;
    padding: 1vmax;
    margin: 5vmax auto;
    color: rgba(0,0,0,0.7);
}

.container {
    display: flex;
    flex-wrap: wrap;
    margin: 2vmax auto;
    justify-content: center;
    width: 80vw;
}

.productCard {
    width: 14vmax;
    display: flex;
    flex-direction: column;
    color: rgb(48,48,48);
    text-decoration: none;
    margin: 2vmax;
    padding-bottom: 0.5vmax;
    transition: all 0.5s;
}

.productCard > img {
    width: 14vmax;
}

.productCard > div {
    margin: 0.5vmax;
    display: flex;
    justify-content: flex-start;
}

.productCard > div > span {
    margin: 0.5vmax;
    font: 300 0.7vmax "Roboto";
}

.productCard > p {
    font-family: "Roboto";
    font-size: 1.2vmax;
    margin: 1vmax 0.5vmax;
    margin-bottom: 0;
}
.productCard > span {
    margin: 0.5vmax;
    color: tomato;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 1.2vmax;
}

.productCard:hover {
    box-shadow: 0 0 5px rgba(15, 15, 15, 0.26);
    transform: translateY(-1vmax);
}

@media screen and (max-width: 600px) {
    .productCard > p {
        font-size: 1.7vmax;
    }

    .productCard > div {
        display: block;
        margin: 0vmax;
    }

    .productCard > span {
        font-size: 1.5vmax;
    }

    .productCard > div > span {
        margin: 0 0.5vmax;
        font: 300 1vmax "Roboto";
    }
}
```
**Step 129: ** Make a new file named **MetaData.js** inside **/src/components/layout** and type the following code inside it:
```
import React from "react";
import Helmet from "react-helmet";

const MetaData = ({title}) => {
    return (
    <Helmet>
        <title>{title}</title>
    </Helmet>
    )
}

export default MetaData
```
\
Now if you go to the **Home.js** inside **/src/components/Home** and type the following code inside the **Fragment** section then it will change the title of the page:
```
<MetaData title="ECOMMERCE" />
```
\
Also change the title inside the **/public/index.html"" into the following:
```
<title>ECOMMERCE</title>
```
\
Now your **Home.js** will look like the following:
```
import React, { Fragment } from "react";
import "./Home.css"
import Product from "./Product.js";
import MetaData from "../layout/MetaData";

const product = {
  name: "Blue Tshirt",
  images: [{ url: "https://i.ibb.co/DRST11n/1.webp"}],
  price: 3000,
  _id: "Abdullah",
};

const Home = () => {
  return (
    <Fragment>
      <MetaData title="ECOMMERCE" />

      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>

        <a href="#container">
          <button>
            Scroll 
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>

        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
      </div>
    </Fragment>
  )
};

export default Home;
```
