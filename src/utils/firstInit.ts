// import sessions from '../models/sessions';
import telegramInit from './telegramInit';

async function firstInit() {
  // const allSessions = await sessions.getSessions();
  const allSessions = [];


  for (const session of allSessions) {
    const {
      log_session, status, api_id, api_hash, user_id
    } = session;

    if (!status) continue;

    await telegramInit(log_session, api_id, api_hash, user_id);
  }
}

export default firstInit;
