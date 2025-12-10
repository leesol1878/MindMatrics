import Result from "../models/resultModel.js";
export async function createResults(req, res) {
    try {
        // Check if user is authenticated
        if(!req.user || !req.user._id) {
            return res.status(401).json({ 
            success: false,
            message: 'Not implemented' 
        });
    }
        const {quizId, correctAnswers, wrongAnswers } = req.body;
        if(!quizId || correctAnswers === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }
        // Compute wrong if not provided
        const computedwrong = wrongAnswers ;

        const playload = {
            totalQuestions: Number(totalQuestions),
            correct: Number(correctAnswers),
            wrong: computedwrong,
            user: req.user._id,
            quiz: quizId
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
        const { technology = 'all', level } = req.query;
        // see only own results
        const query = { user: req.user._id  };
        // if (technology && technology.toLoweCase() !== 'all') {
        //     query.technology = technology;
        // }
        const items = await Result.find(query)
            .populate({ path: 'user', select: '-password -__v' })
            .populate({ path: 'quiz', select: '-__v' })
            .sort({ createdAt: -1 });
        return res.json({
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
