import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const now = new Date();

    res.json({
        connection: 'OK!',
        time: now,
    });
});

export default router;
