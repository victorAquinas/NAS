import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tooltip/dist/react-tooltip.css';

import Router from './routes/index.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Router />
	</StrictMode>
);
