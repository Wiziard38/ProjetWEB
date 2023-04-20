JSFILEFRONT=js_report_front.txt
JSFILEBACK=js_report_back.txt
# CYFILE=cypress_report.txt
# STFILE=Jtest_report.txt

# =========================================
#       Badge pour le rapport JS Front
# =========================================

if test -f "$JSFILEFRONT"; then
    NBERR=$(grep -e "^ERROR" $JSFILE | wc -l)
    NBWARN=$(grep -e "^WARNING" $JSFILE | wc -l)

    if [[ $NBERR > 0 ]]; then 
        # Il y a des erreurs
        wget https://img.shields.io/badge/js_lint_front-failed-red?style=plastic -O js_lint_front.svg
    else 
        if [[ $NBWARN > 0 ]]; then 
            # Il y a des warnings
            wget https://img.shields.io/badge/js_lint_front-failed-orange?style=plastic -O js_lint_front.svg
        else 
            # Aucun probleme
            wget https://img.shields.io/badge/js_lint_front-passed-green?style=plastic -O js_lint_front.svg
        fi
    fi
else
    # Le fichier de rapport n'existe pas
    wget https://img.shields.io/badge/js_lint_front-unknown-lightgray?style=plastic -O js_lint_front.svg
fi

# =========================================
#       Badge pour le rapport JS Back
# =========================================

if test -f "$JSFILEFRONT"; then
    NBERR=$(grep -e "^ERROR" $JSFILE | wc -l)
    NBWARN=$(grep -e "^WARNING" $JSFILE | wc -l)

    if [[ $NBERR > 0 ]]; then 
        # Il y a des erreurs
        wget https://img.shields.io/badge/js_lint_back-failed-red?style=plastic -O js_lint_back.svg
    else 
        if [[ $NBWARN > 0 ]]; then 
            # Il y a des warnings
            wget https://img.shields.io/badge/js_lint_back-failed-orange?style=plastic -O js_lint_back.svg
        else 
            # Aucun probleme
            wget https://img.shields.io/badge/js_lint_back-passed-green?style=plastic -O js_lint_back.svg
        fi
    fi
else
    # Le fichier de rapport n'existe pas
    wget https://img.shields.io/badge/js_lint_back-unknown-lightgray?style=plastic -O js_lint_back.svg
fi

# ====================================
#       Badge pour les tests
# ====================================

# if test -f "$CYFILE"; then
#     # On recupere pour le test si il est passé ou non
#     PASSING=$(cat $CYFILE | grep -e "✔" | grep -e "frontendTests.cy.js" | wc -l);
#     if [[ "$PASSING" -eq "1" ]]; then
#         # Le test est passé
#         echo "==========================================="
#         wget https://img.shields.io/badge/tests-success-green?style=plastic -O cy_tests.svg
#     else 
#         # Le test est raté
#         wget https://img.shields.io/badge/tests-failed-red?style=plastic -O cy_tests.svg
#     fi
# else
#     # Le fichier de rapport n'existe pas
#     wget https://img.shields.io/badge/tests-unknown-lightgray?style=plastic -O cy_tests.svg
# fi

# if test -f "$STFILE"; then
#     # On recupere pour le test si il est passé ou non
#     FAILED=$(cat $STFILE | grep -e "Tests:.*failed" | wc -l)
#     echo $FAILED

#     if [[ $FAILED == 0 ]]; then
#         # Le test est passé
#         wget https://img.shields.io/badge/tests-success-green?style=plastic -O Jtests.svg
#     else 
#         # Le test est raté
#         wget https://img.shields.io/badge/tests-failed-red?style=plastic -O Jtests.svg
#     fi
# else
#     # Le fichier de rapport n'existe pas
#     wget https://img.shields.io/badge/tests-unknown-lightgray?style=plastic -O Jtests.svg
# fi
