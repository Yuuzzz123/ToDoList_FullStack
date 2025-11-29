import Task from '../models/Task.js'

export const getAllTasks = async (req,res) => {
    try{
        const result = await Task.aggregate([
            {
                $facet: {
                    tasks: [{ $sort: {createdAt: -1}}],
                    activeCount: [{$match: {status: "active"}}, {$count: "count"}],
                    completeCount: [{$match: {status: "complete"}}, {$count: "count"}]
                },
            },
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        res.status(200).json({tasks, activeCount, completeCount});
    }
    catch(error){
        console.error("Lỗi khi GetAllTasks ", error);
        res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const createTasks = async (req,res) => {
    try{
        const {title} = req.body;
        const task = new Task({title});

        const newTask = await task.save();
        res.status(201).json(newTask);
    }
    catch(error){
        console.error("Lỗi khi CreateTask ", error);
        res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const updateTasks = async (req,res) => {
    try{
        const {title, status, completeAt} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completeAt
            },
            {new : true}
        );

        if(!updateTasks){
            return res.status(404).json({message:"Task không tồn tại"});
        }
        res.status(200).json(updatedTask);
    }
    catch(error){
        console.error("Lỗi khi UpdateTask ", error);
        res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const deleteTasks = async (req,res) =>{try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask){
            return res.status(404).json({message:"Task không tồn tại"});
        }

        res.status(200).json(deletedTask);
    }
    catch(error){
        console.error("Lỗi khi DeleteTask ", error);
        res.status(500).json({message: "Lỗi hệ thống"});
    }
}