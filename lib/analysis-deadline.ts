/**
 * Exécute `run` avec une échéance ferme.
 *
 * - `run` reçoit un signal d'annulation, déclenché à l'échéance : il le passe
 *   au SDK, qui abandonne la requête HTTP en cours.
 * - La promesse renvoyée est rejetée par `onTimeout()` dès l'échéance, même si
 *   `run` ne réagit pas au signal. Le SDK Anthropic, par exemple, ne regarde
 *   le signal ni pendant l'attente entre deux tentatives ni après une
 *   consigne Retry-After : sans cette course, il pourrait dépasser l'échéance.
 * - Une échéance déjà passée (ms <= 0) rejette sans appeler `run`.
 */
export async function runWithDeadline<T>(
  ms: number,
  run: (signal: AbortSignal) => Promise<T>,
  onTimeout: () => Error,
): Promise<T> {
  if (!(ms > 0)) throw onTimeout();

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(onTimeout());
    }, ms);
  });

  try {
    return await Promise.race([run(controller.signal), timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
