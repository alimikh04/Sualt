type Props = {
  onLogin: () => void;
  lang: 'kk' | 'ru';
  onLang: (lang: 'kk' | 'ru') => void;
};

export function LoginPage({ onLogin, lang, onLang }: Props) {
  return (
    <div className="login-card">
      <h1>ITtcargo Control Tower</h1>
      <p>{lang === 'kk' ? 'Корпоративтік панельге кіру' : 'Вход в корпоративную панель'}</p>
      <div className="row">
        <button onClick={() => onLang('kk')} className={lang === 'kk' ? 'active' : ''}>KK</button>
        <button onClick={() => onLang('ru')} className={lang === 'ru' ? 'active' : ''}>RU</button>
      </div>
      <input placeholder={lang === 'kk' ? 'Телефон' : 'Телефон'} defaultValue="+7 701 111 22 33" />
      <input placeholder="OTP" defaultValue="0000" />
      <button onClick={onLogin}>{lang === 'kk' ? 'Кіру' : 'Войти'}</button>
    </div>
  );
}
