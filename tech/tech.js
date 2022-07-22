function cloneElement(element, iframe = false) {
  const newElement = element.cloneNode(true);
  if (iframe){
    const iframeElement = document.createElement('iframe');
    iframe.src="about:blank";
    iframeElement.srcdoc =
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="../reset.css"/>
    <link rel="stylesheet" href="../style.css"/>
    <title>Marvel Tech</title>
  </head>
  <body>
    ${newElement.outerHTML}
  </body>
</html>
`
      ;
    return iframeElement;
  }
  return newElement;

}
updateTechParams = (techParams) => {
  localStorage.setItem('techParams', JSON.stringify(techParams));
}

function init() {

  const techParams = JSON.parse(localStorage.getItem('techParams')) || {activeElement: '', enabled: false};


  const select = document.createElement('select');

  const techHeader = document.createElement('div');
  techHeader.className = 'tech__header';

  const selectableBlocks = document.querySelectorAll('.selectable');
  const elementsBlock = document.querySelector('.tech__content');

  for (let selectableBlock of selectableBlocks) {
    const option = document.createElement('option');
    option.innerText = selectableBlock.className;
    option.relatedElement = selectableBlock;
    if (techParams.activeElement === selectableBlock.className)
      option.selected = true;
    select.append(option)
  }

  const desktopTech = document.createElement('div');
  desktopTech.className = 'techBlock__desktop';
  desktopTech.innerHTML = `<div class="techBlock tech__full"></div><div class="techBlock tech__1280"></div><div class="techBlock tech__1024"></div><div class="techBlock__row"></div>`;
  const desktopTechBlocks = desktopTech.querySelectorAll('.techBlock');

  const mobileTech = document.createElement('div');
  mobileTech.className = 'techBlock__row techBlock__mobile';
  mobileTech.innerHTML = `<div class="techBlock tech__769"></div><div class="techBlock tech__480"></div><div class="techBlock tech__320"></div>`;
  const mobileTechBlocks = mobileTech.querySelectorAll('.techBlock');

  document.body.prepend(mobileTech);
  document.body.prepend(desktopTech);
  document.body.prepend(techHeader);

  const populateElement = (element) => {
    for (let desktopTechBlock of desktopTechBlocks){
      desktopTechBlock.innerHTML = '';
      desktopTechBlock.append(cloneElement(element));
    }
    for (let mobileTechBlock of mobileTechBlocks){
      mobileTechBlock.innerHTML = '';
      mobileTechBlock.append(cloneElement(element, true));
    }
  }

  const handleSelectChange = (value) => {
    let selectedOption = null;
    for (selectedOption of select.children){
      if (selectedOption.innerText === value)
        break
    }
    techParams.activeElement = selectedOption.relatedElement.className;
    updateTechParams(techParams);
    populateElement(selectedOption.relatedElement)
  }

  select.addEventListener('change', (e) => {
    handleSelectChange(e.target.value)
  });
  handleSelectChange(techParams.activeElement);

  const toggleContent = document.createElement('input');
  toggleContent.type = 'checkbox'
  if (techParams.enabled) toggleContent.checked = true;

  const handleToggleChange = (value) => {
    if (value) {
      elementsBlock.style.display = "none";
      mobileTech.style.display = "";
      desktopTech.style.display = "";
      select.disabled = false;
    } else {
      elementsBlock.style.display = "";
      mobileTech.style.display = "none";
      desktopTech.style.display = "none";
      select.disabled = true;
    }
  }

  handleToggleChange(techParams.enabled);
  toggleContent.addEventListener('change', (e) => {
    techParams.enabled = e.target.checked;
    updateTechParams(techParams);
    handleToggleChange(e.target.checked)
  })


  techHeader.append(toggleContent);
  techHeader.append(select);
}

init();

