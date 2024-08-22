import mongoose, { Schema } from "mongoose"
import moment from "moment-timezone"

function convertToIST(date) {
    let utcDate = new Date(date);
    let utcTime = utcDate.getTime();
    let istOffset = 5.5 * 60 * 60 * 1000;
    let istDate = new Date(utcTime + istOffset);
    return istDate;
}
const taskSchema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date,  default: () => moment().tz('Asia/Kolkata').toDate()  },
        priority: {
            type: String,
            default: "normal",
            enum: ["high", "medium", "normal", "low"],
        },
        stage: {
            type: String,
            default: "todo",
            enum: ["todo", "in progress", "completed"],
        },
        activities: [
            {
                type: {
                    type: String,
                    default: "assigned",
                    enum: [
                        "assigned",
                        "started",
                        "in progress",
                        "bug",
                        "completed",
                        "commented",
                    ],
                },
                activity: String,
                date: { type: Date,  default: () => moment().tz('Asia/Kolkata').toDate()},
                by: { type: Schema.Types.ObjectId, ref: "User" },
            },
        ],

        subTasks: [
            {
                title: String,
                date: Date,
                tag: String,
            },
        ],
        assets: [String],
        team: [{ type: Schema.Types.ObjectId, ref: "User" }],
        isTrashed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Pre-save hook to convert date to IST
taskSchema.pre('save', function(next) {
    this.date = convertToIST(this.date);
    next();
});

const Task = mongoose.model("Task", taskSchema)

export default Task