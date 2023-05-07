import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import SizedText from "../SizedText";

export default function Rules() {
  const rules = [
    {
      title: "Principe du jeu",
      body: `L'action se déroule dans un village dont certains habitants sont humains et d'autres des loups-garous. Chaque nuit, les loups-garous se transforment et tuent un villageois. Pour se défendre, chaque jour, les villageois éliminent l'un d'entre eux. Le but de chaque faction est d'éliminer l'autre, mais les humains ne savent pas qui sont les loups-garous avant la fin de la partie. 
      Au début d'une partie, chaque joueur se voit attribuer un rôle : loup-garou ou humain. Ces rôles sont cachés aux autres joueurs. Les loups-garous et les humains sont collectivement appelés « villageois » (en effet les loups-garous sont aussi des habitants du village).
      Lorsque le villageois d'un joueur est tué, ce joueur est éliminé. Les joueurs éliminés ne peuvent plus intervenir mais ont accès en lecture à toutes les discussions du jeu (sur la place du village comme dans le repaire des loups-garous), y compris les discussions archivées.
      Le jeu fonctionne différemment le jour et la nuit. Par défaut le jour dure de 8h00 à 22h00 et la nuit de 22h00 à 8h00. Ces horaires sont configurables avant le lancement d'une partie.`,
    },
    {
      title: "Votes",
      body: `Le jeu comporte un certain nombre de votes visant à désigner un villageois qui sera tué. Les joueurs peuvent s'organiser comme ils l'entendent dans la salle de discussion appropriée pour définir des modes de scrutin, on ne demande pas au logiciel de gérer cet aspect. Le logiciel doit en revanche permettre d'enregistrer le résultat de la décision collective de la façon suivante :
    L'un des participants au vote propose un joueur à la décision (cela peut être lui-même).
    Les autres participants doivent alors ratifier explicitement cette décision.
    Si la majorité absolue des participants (en comptant le joueur ayant fait la proposition) a ratifié une décision, celle-ci est immédiatement validée et il n'est plus possible d'en changer.
    Il est possible de proposer une décision même s'il y a déjà une autre décision en attente de ratification (mais pas si une autre décision a déjà été validée).
    Si aucune décision n'a été ratifiée à la fin de la période (jour ou nuit), personne n'est tué.`,
    },
    {
      title: "Déroulement de la partie",
      body: `Le jour, tous les villageois encore vivants peuvent discuter librement sur la place du village. Celle-ci comprend une liste chronologique de messages depuis le matin. Chaque joueur peut lire tous ces messages et, s'il est encore vivant, poster un nouveau message qui s'ajoutera à la liste. Les messages identifient clairement leur auteur : il n'est possible ni de poster de façon anonyme ni d'usurper une identité.
    Les villageois peuvent décider de lyncher l'un des leurs, accusé d'être un loup-garou, chaque jour, selon la procédure décrite dans le paragraphe « votes ». Ce villageois est alors tué. Lorsque la nuit tombe, les discussions du jour sont archivées et ne sont plus visibles par les joueurs encore en jeu.
    Pendant la nuit, les loups-garous se réunissent dans leur repaire et peuvent décider de dévorer l'un des villageois, à nouveau selon la procédure du paragraphe « votes ». Ce villageois est alors tué. Le repaire des loups-garous fonctionne comme la place du village, mais seuls les loups-garous y ont normalement accès (voir « pouvoirs spéciaux » pour les exceptions).
    Le matin, les discussions de la nuit sont archivées et ne sont plus visibles par les joueurs encore en jeu.
    Le logiciel indique sur la place du village qui a été retrouvé mort…`,
    },
    {
      title: "Fin de la partie",
      body: `Une partie se termine dès qu'il ne reste plus en jeu que des loups-garous ou que des humains. Une fois la partie terminée, les archives des discussions sont rendues visibles à tous.`,
    },
    {
      title: "Pouvoirs spéciaux",
      body: `On souhaite pouvoir configurer des parties où certains joueurs seront dotés de pouvoirs spéciaux. Ces pouvoirs spéciaux sont :
    Contamination (disponible uniquement pour les loups-garous) : permet au joueur de transformer chaque nuit un humain en loup-garou.
    Insomnie (disponible uniquement pour les humains) : permet au joueur d'assister aux discussions du repaire des loups-garous (mais pas de participer en se faisant passer pour un loup-garou).
    Voyance : permet au joueur de connaître le rôle et les pouvoirs d'un joueur de son choix chaque nuit.
    Spiritisme : permet au joueur de parler avec un joueur éliminé de son choix chaque nuit. Il s'agit d'une salle de discussion similaire à la place du village mais avec seulement deux participants.
    Les pouvoirs sont secrets, c'est-à-dire que le logiciel ne doit jamais indiquer à un joueur quels pouvoirs ont les autres (les joueurs peuvent en revanche en parler et il est par exemple envisageable pour un loup-garou de prouver aux autres qu'il dispose du pouvoir de contamination en utilisant ce pouvoir).`,
    },
  ];

  function renderItem({ item, index }) {
    return (
      <View key={index}>
        <SizedText
          label={`${index + 1}. ${item.title}`}
          size={"large"}
          textStyle={styles.sectionTitle}
        />
        <SizedText
          label={item.body}
          size={"small"}
          textStyle={styles.description}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SizedText
        label={`Règles du jeu`}
        size={"xlarge"}
        textStyle={styles.title}
      />

      <FlatList
        data={rules}
        renderItem={renderItem}
        style={styles.itemList}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffffaa",
    width: "100%",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 7,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    marginBottom: 15,
  },
});
