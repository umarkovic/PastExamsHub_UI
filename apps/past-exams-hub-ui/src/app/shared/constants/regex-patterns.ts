export class RegexPatterns {
    static readonly EMAIL_REGEX =
      /^[ \t\r\n\v\f]*(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[ \t\r\n\v\f]*$/;
    static readonly PHONE_NUMBER_REGEX = /^([\\+]?[0-9]+[-]?|[0])?[1-9][0-9]{8}$/;
    static readonly YOUTUBE_LINK_REGEX =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    static readonly PASSWORD_STRENGTH_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])[a-zA-Z0-9~!@#\$%\^&*\_\-+=`\|\\()\{\}\[\]:;"'<>,\.\?\/]{8,}$/;
    static readonly CLIENT_NUMBER_REGEX = /^(0|[1-9]\d*)(\s+(0|[1-9]\d*))*$/;
  }