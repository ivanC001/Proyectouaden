document.addEventListener('DOMContentLoaded', () => {
    const btnInd = document.getElementById('btn-individual');
    const btnGrp = document.getElementById('btn-grupos');
    const viewInd = document.getElementById('view-individual');
    const viewGrp = document.getElementById('view-grupos');

    btnInd.addEventListener('click', () => {
        btnInd.classList.add('active');
        btnGrp.classList.remove('active');
        viewInd.classList.remove('hidden');
        viewGrp.classList.add('hidden');
    });

    btnGrp.addEventListener('click', () => {
        btnGrp.classList.add('active');
        btnInd.classList.remove('active');
        viewGrp.classList.remove('hidden');
        viewInd.classList.add('hidden');
    });
});