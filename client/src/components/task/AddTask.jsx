import React, { useState } from "react"
import ModalWrapper from "../ModalWrapper"
import { Dialog } from "@headlessui/react"
import Textbox from "../Textbox"
import { useForm } from "react-hook-form"
import UserList from "./UserList"
import SelectList from "../SelectList"
import { BiImages } from "react-icons/bi"
import Button from "../Button"
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage"
import { app } from "../../utils/firebase"
import {
    useCreateTaskMutation,
    useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice"
import { toast } from "sonner"


// import { dateFormatter, timeFormatter } from "../../utils"

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"]
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"]

const uploadedFileURLs = []
// export const formatDate = (dateString) => {
//     if (!dateString) return 'No date available';
//     const date = new Date(dateString);
//     const options = {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//         timeZone: 'Asia/Kolkata'
//     };
//     return new Intl.DateTimeFormat('en-US', options).format(date);
// };

export const AddTask = ({ open, setOpen, task }) => {
    const defaultValues = {
        title: task?.title || "",
        date: task?.date || "",
        team: [],
        stage: "",
        priority: "",
        assets: []
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues })


    const [team, setTeam] = useState(task?.team || [])
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0])
    const [priority, setPriority] = useState(
        task?.priority?.toUpperCase() || PRIORIRY[2]
    )
    const [assets, setAssets] = useState([])
    const [uploading, setUploading] = useState(false)

    const [createTask, { isLoading }] = useCreateTaskMutation()
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
    const URLS = task?.assets ? [...task.assets] : []

    const submitHandler = async (data) => {
        for (const file of assets) {
            setUploading(true)
            console.log(AddTask);
            try {
                await uploadFile(file)
            } catch (error) {
                console.error("Error uploading file:", error)
                return
            } finally {
                setUploading(false)
            }
        }

        try {
            const newData = {
                ...data,
                assets: [...URLS, ...uploadedFileURLs],
                team,
                stage,
                priority,
            }

            const res = task?._id
                ? await updateTask({ ...newData, _id: task._id }).unwrap()
                : await createTask(newData).unwrap()
            console.log(AddTask)
            toast.success(res.message)

            setTimeout(() => {
                setOpen(false)
            }, 500)
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }

    const handleSelect = (e) => {
        setAssets(e.target.files)
    }

    const uploadFile = async (file) => {
        const storage = getStorage(app)

        const name = new Date().getTime() + file.name
        const storageRef = ref(storage, name)

        const uploadTask = uploadBytesResumable(storageRef, file)

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed", 
                (snapshot) => {
                    console.log("Uploading")
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            uploadedFileURLs.push(downloadURL)
                            resolve()
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            )
        })
    }

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        {task ? "UPDATE TASK" : "ADD TASK"}
                        
                    </Dialog.Title>
                    

                    <div className="mt-2 flex flex-col gap-6 gap-3">
                    {task ? "" : <Textbox
                            placeholder="Task Title"
                            type="text"
                            name="title"
                            label="Task Title"
                            className="w-full rounded"
                            register={register("title", {
                                required: "Title is required",
                            })}
                            error={errors.title ? errors.title.message : ""}

                        />}

                        
                    <div className="w-full flex items-end mt-3">
                        {task ? "" : (
                            <div className="flex w-full gap-3">
                                <div className="w-1/2">
                                <UserList setTeam={setTeam} team={team} />
                                </div>
                                <div className="w-1/2">
                                    <Textbox
                                        placeholder="Date"
                                        type="datetime-local"
                                        name="date"
                                        label="Task Date"
                                        className="w-full rounded"
                                        register={register("date", {
                                            required: "Date is required!",
                                        })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                        { (
                            <div className="w-full flex gap-2">
                                <div className="w-1/2">
                                    <SelectList
                                        label="Task Stage"
                                        lists={LISTS}
                                        selected={stage}
                                        setSelected={setStage}
                                    />
                                </div>
                            </div>
                        )}

                            
                       
                        {task ? "" : <div className="flex gap-4">
                            <SelectList
                                label="Priority Level"
                                lists={PRIORIRY}
                                selected={priority}
                                setSelected={setPriority}
                            />

                            <div className="w-full flex items-center justify-center mt-4">
                                <label
                                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                                    htmlFor="imgUpload"
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="imgUpload"
                                        onChange={(e) => handleSelect(e)}
                                        accept=".jpg, .png, .jpeg"
                                        multiple={true}
                                    />
                                    <BiImages />
                                    <span>Add Assets</span>
                                </label>
                            </div>
                        </div>}

                        <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-2">
                            {uploading ? (
                                <span className="text-sm py-2 text-red-500">
                                    Uploading assets
                                </span>
                            ) : (
                                <Button
                                    label="Submit"
                                    type="submit"
                                    className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                />
                            )}

                            <Button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => setOpen(false)}
                                label="Cancel"
                            />
                        </div>
                    </div>
                </form>
            </ModalWrapper>
        </>
    )
}

export default AddTask