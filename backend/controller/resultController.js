import Result from "../models/resultModel.js";

export async function createResults(req, res) {
    try {
        if(!req.user || !req.user._id) {
            return res.status(401).json({ 
            success: false,
            message: 'Not implemented' 
        });
    }
        const { score, totalQuestions, correctAnswers, wrongAnswers } = req.body;
        if(!technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }
        // Compute wrong if not provided
        const computedwrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

        if (!title){
            return res.status(400).json({ 
                success: false,
                message: 'Title is required' 
            });
        }
        const playload = {
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedwrong,
            user: req.user._id
        };
        const created = await Result.create(playload);
        return res.status(201).json({
            success: true,
            message: 'Result created successfully',
            result: created
        });
}
    catch (error) {
        console.error('Create Result Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }
    
}

//List the result
export async function listResults(req, res) {
    try {
        if(!req.user || !req.user._id) {
            return res.status(401).json({
            success: false,
            message: 'Not implemented' 
            })
        }
        const { technology, level } = req.query;
        const query = { user: req.user._id };
        if (technology && technology.toLoweCase() !== 'all') {
            query.technology = technology;
        }
        const items = await Result.find(query).sort({ createdAt: -1 }).lean();
        return res.jason({
            success: true,
            results: items
        });
    }
    catch (error) {
        console.error('List Results Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error' 
        })
    }
}
