import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('This is the user route');
});

router.get('/user/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`This is the user route for user ID: ${userId}`);
});

export default router;