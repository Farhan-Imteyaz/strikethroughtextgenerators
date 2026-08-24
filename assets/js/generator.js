// strikethroughtextgenerators.com — strikethrough generator logic (homepage only)
(function(){
  var input = document.getElementById('input');
  var output = document.getElementById('output');
  var inCount = document.getElementById('inCount');
  var outCount = document.getElementById('outCount');
  var copyBtn = document.getElementById('copyBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var clearBtn = document.getElementById('clearBtn');
  var copyMsg = document.getElementById('copyMsg');
  var fileInput = document.getElementById('fileInput');
  var fileName = document.getElementById('fileName');
  var boldToggle = document.getElementById('boldToggle');
  var italicToggle = document.getElementById('italicToggle');
  var pills = document.querySelectorAll('.pill');
  var uploadZone = document.getElementById('uploadZone');
  if(!input || !output) return; // not on this page

  var STRIKE = {
    long: '\u0336', short: '\u0335', double: '\u0336\u0332', wavy: '\u0334',
    underline: '\u0332', overline: '\u0305', dotted: '\u0323', tilde: '\u0303', slash: '\u0337'
  };
  var style = 'long';

  var BOLD_UP = 0x1D400, BOLD_LOW = 0x1D41A, BOLD_DIGIT = 0x1D7CE;
  var ITAL_UP = 0x1D434, ITAL_LOW = 0x1D44E;
  var BI_UP = 0x1D468, BI_LOW = 0x1D482;

  function transformChar(ch, bold, italic){
    var code = ch.codePointAt(0);
    if(bold && italic){
      if(ch>='A'&&ch<='Z') return String.fromCodePoint(BI_UP+(code-65));
      if(ch>='a'&&ch<='z') return String.fromCodePoint(BI_LOW+(code-97));
      return ch;
    }
    if(bold){
      if(ch>='A'&&ch<='Z') return String.fromCodePoint(BOLD_UP+(code-65));
      if(ch>='a'&&ch<='z') return String.fromCodePoint(BOLD_LOW+(code-97));
      if(ch>='0'&&ch<='9') return String.fromCodePoint(BOLD_DIGIT+(code-48));
      return ch;
    }
    if(italic){
      if(ch==='h') return '\u210E';
      if(ch>='A'&&ch<='Z') return String.fromCodePoint(ITAL_UP+(code-65));
      if(ch>='a'&&ch<='z') return String.fromCodePoint(ITAL_LOW+(code-97));
      return ch;
    }
    return ch;
  }

  function toStrikethrough(text, styleKey, bold, italic){
    var mark = STRIKE[styleKey] || STRIKE.long;
    return Array.from(text).map(function(ch){
      if(ch === '\n') return ch;
      return transformChar(ch, bold, italic) + mark;
    }).join('');
  }

  function render(){
    var text = input.value;
    inCount.textContent = text.length + ' characters';
    var result = text ? toStrikethrough(text, style, boldToggle.checked, italicToggle.checked) : '';
    output.textContent = result;
    outCount.textContent = result.length + ' characters';
  }

  function loadFile(file){
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      input.value = e.target.result;
      fileName.textContent = file.name;
      render();
    };
    reader.readAsText(file);
  }

  input.addEventListener('input', render);
  boldToggle.addEventListener('change', render);
  italicToggle.addEventListener('change', render);

  pills.forEach(function(p){
    p.addEventListener('click', function(){
      pills.forEach(function(x){ x.classList.remove('active'); });
      p.classList.add('active');
      style = p.dataset.style;
      render();
    });
  });

  fileInput.addEventListener('change', function(){
    loadFile(fileInput.files[0]);
  });

  if(uploadZone){
    ['dragenter','dragover'].forEach(function(evt){
      uploadZone.addEventListener(evt, function(e){ e.preventDefault(); uploadZone.classList.add('dragover'); });
    });
    ['dragleave','drop'].forEach(function(evt){
      uploadZone.addEventListener(evt, function(e){ e.preventDefault(); uploadZone.classList.remove('dragover'); });
    });
    uploadZone.addEventListener('drop', function(e){
      loadFile(e.dataTransfer.files[0]);
    });
  }

  copyBtn.addEventListener('click', async function(){
    var text = output.textContent;
    if(!text) return;
    try{ await navigator.clipboard.writeText(text); }
    catch(e){
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    copyBtn.classList.add('success');
    copyMsg.classList.add('show');
    setTimeout(function(){
      copyBtn.classList.remove('success');
      copyMsg.classList.remove('show');
    }, 1400);
  });

  downloadBtn.addEventListener('click', function(){
    var text = output.textContent;
    if(!text) return;
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'strikethrough-text.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  clearBtn.addEventListener('click', function(){
    input.value = ''; fileName.textContent = '';
    render(); input.focus();
  });

  output.addEventListener('click', function(){ if(output.textContent) copyBtn.click(); });

  input.value = 'First draft, then revised';
  render();
})();