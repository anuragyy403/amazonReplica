const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {type: String,
        required:true
    },
    email: {type: String,
        required : true
    },
    password: {type: String,
        required : true
    },
    role: {type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {timestamps: true}
);

//Hash Passsword before saving 

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Compare Entered password with hashed one 

userSchema.methods.matchPassword = async (enteredPassword) => {
    return await bcrypt.compare(enterdPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);