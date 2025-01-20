import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    congressCode:{
        type:String,
        default:""
    },
    originalCode:{
        type:String,
        default:""
    },
    publisher:{
        type:String,
        default:""
    },
    isbn:{
        type:String,
        default:""
    },
    categories:[{ 
        type: mongoose.Types.ObjectId, 
        ref: "BookCategory" 
    }],
    bookName:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    bookCountAvailable:{
        type:Number,
        require:true
    },
    transactions:[{
        type:mongoose.Types.ObjectId,
        ref:"BookTransaction"
    }],
    bookStatus:{
        type:String,
        default:"Available"
    }
},
{
    timestamps:true
})

export default mongoose.model("Book",BookSchema)