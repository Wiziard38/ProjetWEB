JSFILE=js_report.txt
CYFILE=cypress_report.txt
STFILE=Jtest_report.txt

# ====================================
#       Badge pour le rapport JS
# ====================================

if test -f "$JSFILE"; then
    NBERR=$(grep -e "^ERROR" $JSFILE | wc -l)
    NBWARN=$(grep -e "^WARNING" $JSFILE | wc -l)

    if [[ $NBERR > 0 ]]; then 
        # Il y a des erreurs
        wget https://img.shields.io/badge/js_lint-failed-red?style=plastic -O js_lint.svg
    else 
        if [[ $NBWARN > 0 ]]; then 
            # Il y a des warnings
            wget https://img.shields.io/badge/js_lint-failed-orange?style=plastic -O js_lint.svg
        else 
            # Aucun probleme
            wget https://img.shields.io/badge/js_lint-passed-green?style=plastic -O js_lint.svg
        fi
    fi
else
    # Le fichier de rapport n'existe pas
    wget https://img.shields.io/badge/js_lint-unknown-lightgray?style=plastic -O js_lint.svg
fi

# ====================================
#       Badge pour les tests
# ====================================

if test -f "$CYFILE"; then
    # On recupere pour le test si il est passé ou non
    PASSING=$(cat $CYFILE | grep -e "✔" | grep -e "frontendTests.cy.js" | wc -l);
    if [[ "$PASSING" -eq "1" ]]; then
        # Le test est passé
        echo "==========================================="
        wget https://img.shields.io/badge/tests-success-green?style=plastic -O cy_tests.svg
    else 
        # Le test est raté
        wget https://img.shields.io/badge/tests-failed-red?style=plastic -O cy_tests.svg
    fi
else
    # Le fichier de rapport n'existe pas
    wget https://img.shields.io/badge/tests-unknown-lightgray?style=plastic -O cy_tests.svg
fi

if test -f "$STFILE"; then
    # On recupere pour le test si il est passé ou non
    FAILED=$(cat $STFILE | grep -e "Tests:.*failed" | wc -l)
    echo $FAILED

    if [[ $FAILED == 0 ]]; then
        # Le test est passé
        wget https://img.shields.io/badge/tests-success-green?style=plastic -O Jtests.svg
    else 
        # Le test est raté
        wget https://img.shields.io/badge/tests-failed-red?style=plastic -O Jtests.svg
    fi
else
    # Le fichier de rapport n'existe pas
    wget https://img.shields.io/badge/tests-unknown-lightgray?style=plastic -O Jtests.svg
fi
