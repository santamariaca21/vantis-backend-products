import app from './app';
import { config } from './config';

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
