let inactivityLink = 'https://app.prolific.com/submissions/complete?cc=C2OKOATO';
let abortStudyLink = 'https://app.prolific.com/submissions/complete?cc=C117HMQ7';
let noConsentLink = 'https://app.prolific.com/submissions/complete?cc=CSJBUBWO';
let studyCompletedLink = 'https://app.prolific.com/submissions/complete?cc=CCLZ3TGR'

function abortStudy() {
    if (confirm("Are you sure you want to abort the study? You will be redirected to Prolific and marked as incomplete.")) {
        studyInProgress = false;
        jatos.endStudyAndRedirect(abortStudyLink);
    }
}
window.abortStudyLink = abortStudyLink
window.inactivityLink = inactivityLink